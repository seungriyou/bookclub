import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import EssayViewPost from '../components/EssayViewPost';
import EssayCommentList from '../components/EssayCommentList';
import ReplyInput from '../components/ReplyInput';
import { ProgressContext } from '../contexts';
import { DB, Storage, getCurrentUser} from '../utils/firebase';
import moment from 'moment';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.appBackground};
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 100px;
`;
const CommentForm = styled.View`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
`;

const MyClubEssayView = ({ navigation, route }) => {
  const { spinner } = useContext(ProgressContext);
  const essayId = route.params.id;
  const clubId = route.params.clubId;
  const author = route.params.author;
  const user = getCurrentUser();
  const [update, setUpdate] = useState(0); //새로고침을 위한 변수
  const [essayData, setEssayData] = useState({
    title: '',
    writer_name: '',
    upload_date: '',
    content: '',
    ocr_text: '',
    comment: [],
    comment_cnt: 0,
    like_cnt: 0,
    like: {},
  });
  const [isAuthor, setIsAuthor] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const _handleReplyChange = text => {
    setComment(text);
  };

  const _handleLikeButtonPress = async() => {

    try{
      const essayRef = DB.collection('clubs').doc(clubId).collection('essay').doc(essayId);
      await DB.runTransaction(async (t) => {
        const doc = await t.get(essayRef);
        const data = doc.data();

        const oldLike = data.like_table;
        const oldLikeCnt = data.like_cnt;

        let newLike = data.like_table;
        let newLikeCnt = data.like_cnt;

        if(oldLike.hasOwnProperty(user.uid)) {
          if(oldLike[user.uid] === true) {
            newLike[user.uid] = false;
            newLikeCnt = oldLikeCnt - 1;
          }
        }
        else {
          newLike[user.uid] = true;
          newLikeCnt = oldLikeCnt + 1;
        }

        t.update(essayRef, {like_table: newLike, like_cnt: newLikeCnt});
      });

      if(isLiked === true) {
        Alert.alert("좋아요 취소");
      }
      else {
        Alert.alert("좋아요");
      }

    }
    catch (e) {
      Alert.alert('댓글 작성 오류', e.message);
    }
    finally{
      spinner.stop();
      setUpdate(update => update + 1);
    }

  }

  const getEssay = async() => {
    try{
      spinner.start();
      const essayRef = await DB.collection('clubs').doc(clubId).collection('essay').doc(essayId).get();
      const data = essayRef.data();

      if (data.author.uid === user.uid) {
        setIsAuthor(true);
        console.log("isAuthor true");
      }

      const tempData = {
        title: data.title,
        writer_name: data.author.name,
        upload_date: data.createAt,
        content: data.content,
        comment: data.comment,
        comment_cnt: data.comment_cnt,
        ocr_text: data.ocrText,
        like: data.like_table,
        like_cnt: data.like_cnt,
      }
      setEssayData(tempData);
    }
    catch (e) {
      Alert.alert('에세이 데이터 수신 오류', e.message);
    }
    finally{
      spinner.stop();
    }
  }

  const _addReply = async () => {
    if (!comment) {
      Alert.alert("댓글을 입력해주세요.");
    }
    else {
      Alert.alert(`댓글을 입력하였습니다.`, `댓글 내용:${comment}`);
      console.log(`Comment: ${comment}`);
      try{
        const essayRef = DB.collection('clubs').doc(clubId).collection('essay').doc(essayId);
        await DB.runTransaction(async (t) => {
          const doc = await t.get(essayRef);
          const data = doc.data();


          const oldComment = data.comment;
          const oldCommentCnt = data.comment_cnt;

          let newCommentIdx = 0;

          if (oldCommentCnt == 0) {
            newCommentIdx = 0;
          }
          else {
            newCommentIdx = oldComment[oldCommentCnt - 1].id + 1;
          }

          const tempComment = {
            id: newCommentIdx,
            writer: user,
            content: comment,
            upload_date: Date.now(),
          }


          const newCommentCnt = oldCommentCnt + 1;

          oldComment.push(tempComment)

          const newComment = oldComment;

          t.update(essayRef, {comment: newComment, comment_cnt: newCommentCnt});
        });
        setComment('');

      }
      catch (e) {
        Alert.alert('댓글 작성 오류', e.message);
      }
      finally{
        spinner.stop();
        setUpdate(update => update + 1);
      }
    }
  };

  useLayoutEffect(() => {
    //console.log(navigation);
    getEssay();
  }, []);

  useEffect(() => {
    getEssay();
  }, [update]);

  useEffect(() => {
    const isExist = essayData.like.hasOwnProperty(user.uid);
    if(isExist) {
      if(essayData.like[user.uid] == true) {
        setIsLiked(true);
      }
      else {
        setIsLiked(false);
      }
    }
    else {
      setIsLiked(false);
    }
  }, [essayData]);

  useEffect(() => {
    getEssay();
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={30}
            style={{ marginRight: 20 }}
            color={theme.buttonIcon}
            onPress={_handleLikeButtonPress} // 좋아요 버튼 함수(이벤트 추가 필요)
          />
          <MaterialIcons
            name="edit"
            size={30}
            style={{ marginRight: 13 }}
            color={theme.buttonIcon}
            onPress={() => { Alert.alert("글을 수정합니다.") }} //글 수정 버튼 함수(이벤트 추가 필요)
          />
        </View>
      ),
    });
  }, [isLiked]);



  return (
    <View style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <KeyboardAwareScrollView extraScrollHeight={20}>
        <Container>
          <EssayViewPost postInfo={essayData}></EssayViewPost>
          {!essayData.comment_cnt || <EssayCommentList postInfo={essayData}></EssayCommentList>}
        </Container>
      </KeyboardAwareScrollView>
      <CommentForm>
        <ReplyInput
          placeholder="댓글을 입력하세요."
          value={comment}
          onChangeText={_handleReplyChange}
          onSubmitEditing={() => { }}
          onPress={_addReply}
        />
      </CommentForm>
    </View>
  )
};

export default MyClubEssayView;
