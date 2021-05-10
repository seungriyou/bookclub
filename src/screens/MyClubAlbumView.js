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
import { theme } from '../theme';

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
    <View style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <KeyboardAwareScrollView extraScrollHeight={20}>
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
