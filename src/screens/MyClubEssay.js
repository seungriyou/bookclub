import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import EssayTitleInput from '../components/EssayTitleInput';
import EssayContentInput from '../components/EssayContentInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import {Alert} from 'react-native';
import { ProgressContext } from '../contexts';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.appBackground};
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 30px;
`;

const MyClubEssay = ({ navigation, route }) => {
  const { spinner } = useContext(ProgressContext);

  const id = route.params.id;
  const user = getCurrentUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [OCRText, setOCRText] = useState('');

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
  }, [title, content, OCRText]);

  const _handleTitleChange = text => {
    setTitle(text);
  };
  const _handleOCRTextChange = text => {
    setOCRText(text);
  };
  const _handleContentChange = text => {
    setContent(text);
  };

  const myClubEssayWrite = async() => {
    const essayRef = DB.collection('clubs').doc(id).collection('essay').doc();
    const newEssay = {
      id: essayRef.id,
      author: user,
      title,
      ocrText: OCRText,
      content,
      createAt: Date.now(),
      comment: [],
      comment_cnt: 0,
      like_table: {},
      like_cnt: 0,
    }

    await essayRef.set(newEssay);

    return true;
  }

  // DB와 연결할 부분. 현재는 console 출력으로 대체함
  const _handleCompleteButtonPress = async () => {
    if (title == '' || OCRText == '' || content == '') {
      alert(`제목 또는 텍스트가 없습니다.`);
    }
    else {
      try {
        spinner.start();
        await myClubEssayWrite();
        navigation.navigate('MyClubTab', {screen: 'MyClubEssayList'});
        Alert.alert('에세이 등록이 완료되었습니다.');
      }
      catch(e) {
        Alert.alert('에세이 업로드 오류', e.message);
      }
      finally {
        spinner.stop();
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: theme.appBackground }}>
        <Container>
          <EssayTitleInput
            placeholder="제목"
            value={title}
            onChangeText={_handleTitleChange}
          />
          <EssayContentInput
            OCRValue={OCRText}
            onChangeOCRText={_handleOCRTextChange}
            contentValue={content}
            onChangeContentText={_handleContentChange}
          />
        </Container>
      </KeyboardAwareScrollView>
    </ThemeProvider>
  );
};

export default MyClubEssay;
