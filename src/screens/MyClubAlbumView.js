import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, ScrollView, Alert } from 'react-native';
import AlbumViewPost from '../components/AlbumViewPost';
import CommentList from '../components/CommentList';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ReplyInput from '../components/ReplyInput';
import { ProgressContext } from '../contexts';
import { DB, Storage, getCurrentUser} from '../utils/firebase';
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

const Layout=styled.View`
    background-color: ${({theme})=>theme.background};
    align-items: center;
    flex-direction: row;
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
  const [isAuthor, setIsAuthor] = useState(false);

  const _handleReplyChange = text => {
    setComment(text);
  };

  const _handelEditButtonPress = () => {
    Alert.alert("글을 수정합니다");
  }

  const _handelDeleteButtonPress = async () => {
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
            const albumRef = await DB.collection('clubs').doc(clubId).collection('album').doc(albumId).delete();
            const storageRef = Storage.ref();
            const storageAlbumRef = storageRef.child(`clubs/${clubId}/albums/${albumId}`);
            storageAlbumRef.listAll().then(res => {
              res.items.forEach( itemRef => {
                itemRef.delete().then(() => {})
                .catch(e => {console.log(e.message)});
              });
            });
            navigation.navigate("MyClubTab", {screen: "MyClubAlbumList", params: {id: clubId}});
            Alert.alert("앨범 삭제 완료");
          }
          catch(e) {
            Alert.alert("앨범 삭제 오류", e.message);
          }
        }
      }
    ]);
  }

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
            const oldComment = albumData.comment;
            let list = [];
            for (let com of oldComment) {
              if(com.id !== id){
                list.push(com);
              }
            }

            const albumRef = DB.collection('clubs').doc(clubId).collection('album').doc(albumId);
            await DB.runTransaction(async (t) => {
              t.update(albumRef, {comment: list, comment_cnt: (albumData.comment_cnt - 1)});
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
              const oldComment = albumData.comment;
              let list = [];
              for (let com of oldComment) {
                if(com.id === id){
                  com.content = comment;
                }
                list.push(com);
              }

              const albumRef = DB.collection('clubs').doc(clubId).collection('album').doc(albumId);
              await DB.runTransaction(async (t) => {
                t.update(albumRef, {comment: list});
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
      setAlbumData(tempData);

      if (data.author.uid === user.uid) {
        setIsAuthor(true);
      }
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
      Alert.alert("댓글을 입력해주세요.");
    }
    else {
      Alert.alert(`댓글을 입력하였습니다.`, `댓글 내용: ${comment}`);
      try{
        const albumRef = DB.collection('clubs').doc(clubId).collection('album').doc(albumId);
        await DB.runTransaction(async (t) => {
          const doc = await t.get(albumRef);
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


  useEffect(() => {
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
        isAuthor && (
          <Layout>
            <MaterialCommunityIcons
                name="pencil"
                size={30}
                style={{marginRight:13}}
                color={tintColor}
                onPress={_handelEditButtonPress}
            />
            <MaterialCommunityIcons
                name="trash-can"
                size={30}
                style={{marginRight:13}}
                color={tintColor}
                onPress={_handelDeleteButtonPress}
            />
          </Layout>
        )
      ),
    });
  }, [albumData])

  return (
    <View style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <KeyboardAwareScrollView extraScrollHeight={20}>
        <Container>
          <AlbumViewPost postInfo={albumData}></AlbumViewPost>
          {!albumData.comment_cnt || <CommentList postInfo={albumData} userInfo={user} clubId={clubId} onDelete={_handleCommentDelete} onEdit={_handleCommentEdit}></CommentList>}
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
