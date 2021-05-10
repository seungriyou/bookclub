import React, { useState, useEffect, useLayoutEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import EssayTitleInput from '../components/EssayTitleInput';
import EssayContentInput from '../components/EssayContentInput';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.appBackground};
  align-items: center;
  justify-content: flex-start;
`;

const MyClubEssay = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  //const [photos, setPhotos] = useState([]);
  const [content, setContent] = useState('');
  const [OCRtext, setOCRText] = useState('');

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
  }, [title, content, OCRtext]);

  const _handleTitleChange = text => {
    setTitle(text);
  };

  const _handleContentChange = text => {
    setContent(text);
  };

  // DB와 연결할 부분. 현재는 console 출력으로 대체함
  const _handleCompleteButtonPress = async () => {
    if (title == '' || OCRtext == '') {
      alert(`제목 또는 텍스트가 없습니다.`);
    }
    else {
      console.log(`Title: ${title}`);
      console.log(`OCR: ${OCRtext}`);
      console.log(`Content: ${content}`);
      alert(`Uploaded!`);
      //setPhotos([]);
      setTitle('');
      setContent('');
      setOCRText('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <EssayTitleInput
          placeholder="제목"
          value={title}
          onChangeText={_handleTitleChange}
        />
        <EssayContentInput>
        
        </EssayContentInput>
      </Container>
    </ThemeProvider>

    
  )
};

export default MyClubEssay;