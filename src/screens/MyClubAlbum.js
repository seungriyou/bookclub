import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { Alert } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import AlbumTitleInput from '../components/AlbumTitleInput';
import AlbumContentInput from '../components/AlbumContentInput';
import { DB, Storage, getCurrentUser } from '../utils/firebase';
import { ProgressContext } from '../contexts';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.appBackground};
  align-items: center;
  justify-content: flex-start;
`;

const MyClubAlbum = ({ navigation, route }) => {
  const { spinner } = useContext(ProgressContext);
  const [title, setTitle] = useState('');
  const [photos, setPhotos] = useState([]);
  const [content, setContent] = useState('');
  const [id, setId] = useState(0);
  const [albumId, setAlbumId] = useState('');

  useEffect(() => {
    if (route.params.photos) {
      setPhotos(route.params.photos);
    }
  }, [route.params.photos]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="check"
          size={30}
          style={{ marginRight: 13 }}
          color={theme.buttonIcon}
          onPress={_handleCompleteButtonPress}
        />
      ),
    });
  }, [title, content, photos]);

  useEffect(() => {
    setId(route.params?.id);
  }, []);

  useEffect(() => {
    console.log(id);
  }, [id]);


  const _handleTitleChange = text => {
    setTitle(text);
  };

  const _handleContentChange = text => {
    setContent(text);
  };

  const uploadImage = async ({ uri, albumId, name }) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('네트워크 요청 실패'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const ref = Storage.ref(`/clubs/${id}/albums/${albumId}/${name}.jpg`);
    const snapshot = await ref.put(blob, { contentType: 'image/jpg' });

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  const uploadAlbumImage = async () => { //앨범 이미지를 파이어 베이스 스토리지에 업로드 하는 함수
    const user = getCurrentUser();
    const albumRef = DB.collection('clubs').doc(id).collection('album').doc();
    const albumId = albumRef.id;
    const tempUrls = [];

    for (let obj of photos) {
      const uri = obj.uri;
      const name = obj.name;
      const url = await uploadImage({ uri, albumId, name });
      tempUrls.push(url);
    }

    const newBoard = {
      id: albumId,
      title,
      author: user,
      content,
      createAt: Date.now(),
      photoUrls: tempUrls,
      content,
      comment_cnt: 0,
      comment: [],
    };

    await albumRef.set(newBoard);

    return true;
  };


  // DB와 연결할 부분. 현재는 console 출력으로 대체함
  const _handleCompleteButtonPress = async () => {
    if (photos == '' || title == '') {
      alert(`제목 또는 사진이 없습니다.`);
    }
    else {
      try {
        spinner.start();
        await uploadAlbumImage();
        navigation.navigate('MyClubTab', { screen: 'MyClubAlbumList' });
        Alert.alert('앨범 등록이 완료되었습니다.');
      }
      catch (e) {
        Alert.alert('사진 업로드 오류', e.message);
      }
      finally {
        spinner.stop();
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <AlbumTitleInput
          placeholder="제목"
          value={title}
          onChangeText={_handleTitleChange}
        />
        <AlbumContentInput
          onPress={() => navigation.navigate('MyClubAlbumSelectPhoto')}
          photos={photos}
          text={content}
          onChangeText={_handleContentChange}
        />
      </Container>
    </ThemeProvider>
  );
};

export default MyClubAlbum;
