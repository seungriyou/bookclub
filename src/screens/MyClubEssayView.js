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

const tempData = {
  "title": "리스본행 야간열차 (파스칼 메르시어)",
  "writer_name": "관리자",
  "upload_date": "2021/05/05",
  "comment_cnt": 2,
  "comment": [
    {
      "id": 1,
      "writer_name": "멤버A",
      "content": "우리가 우리 안에 있는 것들 가운데 아주 작은 부분만을 경험할 수 있다면 나머지는 어떻게 되는 걸까요?",
      "upload_date": "2021/05/05",
    },
    {
      "id": 2,
      "writer_name": "멤버B",
      "content": "'언어의 연금술사'라는 책이 실제로 있다면 읽어보고 싶네요",
      "upload_date": "2021/05/05",
    }
  ],
  "ocr_text": "-뚜렷하지 않은 심연. 인간 행위의 표면 아래에 우리가 알지 못하는 어떤 비밀이 있을까? 아니면 인간은 자신이 만천하에 드러내는 행동과 완벽하게 일치할까? 아주 이상하게 들리지만, 이 질문에 대한 대답은 이 도시와 타호 강을 비추는 햇빛처럼 내 마음속에서 늘 변한다. 뚜렷하고 예리한 그림자를 만드는, 반짝이는 8월의 매력적인 햇빛은 인간에게 숨겨진 심연이 있다는 나의 생각을 터무니없는 것으로 느끼게 만든다.",
  "content": "파스칼 메르시어의 '리스본행 야간열차'를 읽고 인상적이었던 부분입니다.\n\n소설 속에 등장하는 또 다른 책인 '언어의 연금술사'에 나오는 구절입니다.\n\n책의 36페이지 하단에 위치해있습니다.",
  "like_cnt": 10,
};

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

      console.log(data);

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

          console.log(data);

          const oldComment = data.comment;
          const oldCommentCnt = data.comment_cnt;

          console.log("oldComment : ",oldComment, "cnt : ",oldCommentCnt);

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

          console.log("tempComment : ", tempComment);

          const newCommentCnt = oldCommentCnt + 1;

          oldComment.push(tempComment)

          const newComment = oldComment;

          console.log("newComment : ", newComment);

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
    console.log(isLiked);
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
