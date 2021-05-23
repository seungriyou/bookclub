import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import EssayTitleInput from '../components/EssayTitleInput';
import EssayContentInput from '../components/EssayContentInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DB, getCurrentUser } from '../utils/firebase';
import { Alert } from 'react-native';
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

  const clubId = route.params.clubId;
  const essayId = route.params.essayId;

  console.log(clubId, essayId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [OCRText, setOCRText] = useState('');

  const [data, setData] = useState({
    title: '',
    content: '',
    OCRText: '',
  })

  const _handleTitleChange = text => {
    setTitle(text);
  };

  const _handleOCRTextChange = text => {
    setOCRText(text);
  };

  const _handleContentChange = text => {
    setContent(text);
  };

  const getEssay = async() => {
    try{
      spinner.start();
      const essayRef = DB.collection('clubs').doc(clubId).collection('essay').doc(essayId);
      const essayDoc = await essayRef.get();
      const essayData = essayDoc.data();

      setTitle(essayData.title);
      setContent(essayData.content);
      setOCRText(essayData.ocrText);
    }
    catch(e) {
      Alert.alert('에세이 데이터 수신 오류', e.message);
    }
    finally {
      spinner.stop();
    }
  }

  const _handleCompleteButtonPress = async () => {
    if (title == '' || OCRText == '' || content == '') {
      alert(`제목 또는 글 내용이 없습니다.`);
    }
    else {
      try {
        spinner.start();
        const essayRef = DB.collection('clubs').doc(clubId).collection('essay').doc(essayId);
        await DB.runTransaction(async (t) => {
          t.update(essayRef, {title:title, content: content, ocrText: OCRText});
        });

        navigation.navigate('MyClubTab', {screen: 'MyClubEssayList'});
        Alert.alert('수정이 완료되었습니다.');
      }
      catch(e) {
        Alert.alert('에세이 수정 오류', e.message);
      }
      finally {
        spinner.stop();
      }
    }
  };

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

  useEffect(() => {
    getEssay();
  }, []);

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
