import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import EssayViewPost from '../components/EssayViewPost';
import EssayCommentList from '../components/EssayCommentList';
import ReplyInput from '../components/ReplyInput';
import { ProgressContext } from '../contexts';
import { DB, getCurrentUser} from '../utils/firebase';
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
          if(oldLike[user.uid]) {
            newLike[user.uid] = false;
            newLikeCnt = oldLikeCnt - 1;
          }
          else {
            newLike[user.uid] = true;
            newLikeCnt = oldLikeCnt + 1;
          }
        }
        else {
          newLike[user.uid] = true;
          newLikeCnt = oldLikeCnt + 1;
        }
        console.log("oldLike", oldLike, oldLike[user.uid]);
        console.log(newLike);
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
      Alert.alert('에세이 좋아요 오류', e.message);
    }
    finally{
      spinner.stop();
      setUpdate(update => update + 1);
    }
  }

  const _handelEditButtonPress = () => {
    navigation.navigate('MyClubEssayNav', {screen: 'MyClubEssayEdit', params: {clubId: clubId, essayId: essayId}});
    console.log(clubId, essayId);
  };

  const _handelDeleteButtonPress = () => {
    Alert.alert("경고", "글을 삭제하시겠습니까?",
    [
      {
        text: "아니요",
        style: "cancel"
      },
      {
        text: "예",
        onPress: async () => {
          try {
            const essay = await DB.collection('clubs').doc(clubId).collection('essay').doc(essayId).delete();
            navigation.navigate("MyClubTab", {screen: "MyClubEssayList", params: {id: clubId}});
            Alert.alert("글 삭제 완료");
          }
          catch(e) {
            Alert.alert("글 삭제 오류", e.message);
          }
        }
      }
    ]);
  };

  const _handleCommentDelete = async (id) => {
    Alert.alert("경고", "댓글을 삭제하시겠습니까?",
    [
      {
        text: "아니요",
        style: "cancel"
      },
      {
        text: "예",
        onPress: async () => {
          try {
            const oldComment = essayData.comment;
            let list = [];
            for (let com of oldComment) {
              if(com.id !== id){
                list.push(com);
              }
            }

            const essayRef = DB.collection('clubs').doc(clubId).collection('essay').doc(essayId);
            await DB.runTransaction(async (t) => {
              t.update(essayRef, {comment: list, comment_cnt: (essayData.comment_cnt - 1)});
            });
            setUpdate(update => update + 1);
          }
          catch(e) {
            Alert.alert("댓글 삭제 오류", e.message);
          }
        }
      }
    ]);
  }

  const _handleCommentEdit = (id) => {
    Alert.alert("알림", "댓글을 수정하시겠습니까?",
    [
      {
        text: "아니요",
        style: "cancel"
      },
      {
        text: "예",
        onPress: async () => {
          try {
            if(!comment) {
              Alert.alert("댓글 내용을 입력해주세요.");
            }
            else{
              const oldComment = essayData.comment;
              let list = [];
              for (let com of oldComment) {
                if(com.id === id){
                  com.content = comment;
                }
                list.push(com);
              }

              const essayRef = DB.collection('clubs').doc(clubId).collection('essay').doc(essayId);
              await DB.runTransaction(async (t) => {
                t.update(essayRef, {comment: list});
              });
              setUpdate(update => update + 1);
            }
            setComment('');
          }
          catch(e) {
            Alert.alert("댓글 수정 오류", e.message);
          }
        }
      }
    ]);
  }


  const getEssay = async() => {
    try{
      spinner.start();
      const essayRef = await DB.collection('clubs').doc(clubId).collection('essay').doc(essayId).get();
      const data = essayRef.data();

      if (data.author.uid === user.uid) {
        setIsAuthor(true);
      }

      const isExist = data.like_table.hasOwnProperty(user.uid);
      if(isExist) {
        if(data.like_table[user.uid] === true) {
          setIsLiked(true);
          console.log("isLiked", true);
        }
        else {
          setIsLiked(false);
          console.log("isLiked", false);
        }
      }
      else {
        setIsLiked(false);
        console.log("isLiked", false);
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

  useEffect(() => {
    getEssay();
  }, []);

  useEffect(() => {
    getEssay();
    navigation.setOptions({
      headerRight: () => (
        isAuthor ? (
          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={25}
              style={{ marginRight: 10 }}
              color={theme.buttonIcon}
              onPress={_handleLikeButtonPress} // 좋아요 버튼 함수(이벤트 추가 필요)
            />
            <MaterialCommunityIcons
                name="pencil"
                size={25}
                style={{marginRight:10}}
                color={theme.buttonIcon}
                onPress={_handelEditButtonPress}
            />
            <MaterialCommunityIcons
                name="trash-can"
                size={25}
                style={{marginRight:10}}
                color={theme.buttonIcon}
                onPress={_handelDeleteButtonPress}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={30}
              style={{ marginRight: 20 }}
              color={theme.buttonIcon}
              onPress={_handleLikeButtonPress} // 좋아요 버튼 함수(이벤트 추가 필요)
            />
          </View>
        )
      ),
    });
  }, [isAuthor, isLiked, update]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <KeyboardAwareScrollView extraScrollHeight={20}>
        <Container>
          <EssayViewPost postInfo={essayData}></EssayViewPost>
          {!essayData.comment_cnt || <EssayCommentList postInfo={essayData} userInfo={user} clubId={clubId} onDelete={_handleCommentDelete} onEdit={_handleCommentEdit}></EssayCommentList>}
        </Container>
      </KeyboardAwareScrollView>
      <CommentForm>
        <ReplyInput
          placeholder="댓글을 입력하세요."
          value={comment}
          onChangeText={_handleReplyChange}
          onSubmitEditing={() => {}}
          onPress={_addReply}
        />
      </CommentForm>
    </View>
  )
};

export default MyClubEssayView;
