import React, { useState, useLayoutEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import EssayTitleInput from '../components/EssayTitleInput';
import EssayContentInput from '../components/EssayContentInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.appBackground};
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 30px;
`;

const MyClubEssay = ({ navigation }) => {
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

  // DB와 연결할 부분. 현재는 console 출력으로 대체함
  const _handleCompleteButtonPress = async () => {
    if (title == '' || OCRText == '') {
      alert(`제목 또는 텍스트가 없습니다.`);
    }
    else {
      console.log(`Title: ${title}`);
      console.log(`OCR: ${OCRText}`);
      console.log(`Content: ${content}`);
      alert(`Uploaded!`);
      setTitle('');
      setContent('');
      setOCRText('');
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