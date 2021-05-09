import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { View, ScrollView, Alert } from 'react-native';
import AlbumViewPost from '../components/AlbumViewPost';
import CommentList from '../components/CommentList';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ReplyInput from '../components/ReplyInput';
import { ProgressContext } from '../contexts';
import { DB, getCurrentUser} from '../utils/firebase';
import moment from 'moment';

const tempData = {
  "title": "05월 정기모임",
  "writer_name": "관리자",
  "upload_date": "2021/05/05",
  "comment_cnt": 6,
  "comment": [
    {
      "id": 1,
      "writer_name": "멤버A",
      "content": "재미있었어요!",
      "upload_date": "2021/05/05",
    },
    {
      "id": 2,
      "writer_name": "멤버B",
      "content": "사진 공유 감사합니다 :)",
      "upload_date": "2021/05/05",
    },
    {
      "id": 3,
      "writer_name": "멤버C",
      "content": "확인했습니다~",
      "upload_date": "2021/05/05",
    },
    {
      "id": 4,
      "writer_name": "멤버D",
      "content": "감사합니당!",
      "upload_date": "2021/05/05",
    },
    {
      "id": 5,
      "writer_name": "멤버E",
      "content": "확인했어요! 좋은 주말 되세요~",
      "upload_date": "2021/05/05",
    },
    {
      "id": 6,
      "writer_name": "멤버F",
      "content": "다음 모임에서 뵙겠습니다!",
      "upload_date": "2021/05/06",
    }
  ],
  "photos": [
    {
      "name": "01.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F01.JPG?alt=media&token=17cc5227-0fb2-4290-b9b1-44714cc4a96f",
    },
    {
      "name": "02.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F02.jpg?alt=media&token=51b11215-0081-40cb-9cf6-15cad18b4ba9",
    },
    {
      "name": "03.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F03.jpg?alt=media&token=238c2964-ae74-45f1-9dd4-d9cb122dc5ef",
    },
    {
      "name": "04.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F04.jpg?alt=media&token=6514facf-a35f-46a9-b302-c0cb8221b928",
    },
    {
      "name": "05.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F05.jpg?alt=media&token=89e3c45f-1b06-4ef0-befa-c81e926768bd",
    },
    {
      "name": "06.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F06.JPG?alt=media&token=dfc3f294-62c6-41c3-bbea-082b4187bc7b",
    },
    {
      "name": "07.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F07.jpg?alt=media&token=73290ff8-02b5-4beb-ad56-5c80fb1e9c56",
    },
    {
      "name": "08.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F08.jpg?alt=media&token=e110bad0-2ed2-43b8-8e9b-c58dcc6d5de0",
    },
    {
      "name": "09.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F09.jpg?alt=media&token=51e8bd61-22bd-4048-829e-e43e4d1fa62c",
    },
    {
      "name": "10.jpg",
      "url": "https://firebasestorage.googleapis.com/v0/b/book-club-app-6ceae.appspot.com/o/images%2F10.JPG?alt=media&token=ea70c98b-ee93-4a2a-bebd-03c5903c5188",
    },
  ],
  "content": "05월 정기모임 사진 업로드합니다.\n만나서 반가웠어요!\n\n좋은 주말 되세요 :D\n\n\n다음에 또 봐요!",
};

const Container = styled.View`
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

const MyClubAlbumView = ({ navigation, route }) => {
  const { spinner } = useContext(ProgressContext);
  const albumId = route.params.id;
  const clubId = route.params.clubId;
  const author = route.params.author;
  const user = getCurrentUser();
  const [update, setUpdate] = useState(0); //새로고침을 위한 변수
  const [comment, setComment] = useState('');
  const [albumData, setAlbumData] = useState({
    title: '',
    writer_name: '',
    upload_date: '',
    content: '',
    comment: [],
    comment_cnt: 0,
    photos: [],
  });

  const _handleReplyChange = text => {
    setComment(text);
  };

  const getAlbum = async() => {
    try{
      spinner.start();
      const albumRef = await DB.collection('clubs').doc(clubId).collection('album').doc(albumId).get();
      const data = albumRef.data();

      const tempPhotos = [];

      let index = 0;

      for (let url of data.photoUrls) {
        tempPhotos.push({name: `${index}.jpg`, url: url});
        index = index + 1;
      }

      const tempData = {
        title: data.title,
        writer_name: data.author.name,
        upload_date: data.createAt,
        content: data.content,
        comment: data.comment,
        comment_cnt: data.comment_cnt,
        photos: tempPhotos,
      }
      console.log(tempData);
      setAlbumData(tempData);
    }
    catch (e) {
      Alert.alert('앨범 데이터 수신 오류', e.message);
    }
    finally{
      spinner.stop();
    }
  }

  const getDateOrTime = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
  };


  const _addReply = async () => {
    if (!comment) {
      alert("댓글을 입력해주세요.");
    }
    else {
      alert(`댓글을 입력하였습니다. 댓글 내용:\n${comment}`);
      console.log(`Comment: ${comment}`);
      try{
        const albumRef = DB.collection('clubs').doc(clubId).collection('album').doc(albumId);
        await DB.runTransaction(async (t) => {
          const doc = await t.get(albumRef);
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

          t.update(albumRef, {comment: newComment, comment_cnt: newCommentCnt});
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
    getAlbum();
  }, []);

  useEffect(() => {
    getAlbum();
  }, [update]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTintColor: '#000000',
      headerLeft: ({ onPress, tintColor }) => {
        return (
          <MaterialIcons
            name="keyboard-backspace"
            size={30}
            style={{ marginLeft: 13 }}
            color={tintColor}
            onPress={onPress}
          />
        );
      },
      headerRight: ({ tintColor }) => (
        <MaterialIcons
          name="edit"
          size={30}
          style={{ marginRight: 13 }}
          color={tintColor}
          onPress={() => { alert("글을 수정합니다.") }} //글 등록 버튼 함수(이벤트 추가 필요)
        />
      ),
    });
    //console.log(navigation);
  }, []);

  useEffect(() => {
    console.log(albumData);
  }, [albumData])

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <Container>
          <AlbumViewPost postInfo={albumData}></AlbumViewPost>
          {!albumData.comment_cnt || <CommentList postInfo={albumData}></CommentList>}
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

  );
};

export default MyClubAlbumView;
