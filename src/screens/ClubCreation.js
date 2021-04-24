import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import { Input, Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProgressContext } from '../contexts';
import { createClub, getCurrentUser } from '../utils/firebase';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%
`;

const ClubCreation = ({ navigation }) => {
  const { spinner } = useContext(ProgressContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const descriptionRef = useRef();
  const [region, setRegion] = useState('');
  const regionRef = useRef();
  const [maxNumber, setMaxNumber] = useState('');
  const maxNumberRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const leader = getCurrentUser();

  useEffect(() => {
    setDisabled(!(title && region && !errorMessage));
  }, [title, description, region, maxNumber, errorMessage]);

  const _handelTitleChange = title => {
    setTitle(title);
    setErrorMessage(title.trim() ? '' : '클럽 이름을 입력해주세요');
  };

  const _maxNumberChanged = maxNumber => {
    setMaxNumber(maxNumber);
    if (maxNumber > 100 || maxNumber < 1) {
      setErrorMessage('클럽의 최대 인원은 2 ~ 99사이로 입력해주세요');
    }
  }

  const _handelCreateButtonPress = async () => {
    try {
      spinner.start();
      const id = await createClub({ title, description, leader, region, maxNumber });
      navigation.replace('Club', { id, title, });
    } catch (e) {
      Alert.alert('클럽 생성 오류', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight = {20}
    >
      <Container>
        <Input
          label="클럽 이름"
          value={title}
          onChangeText={_handelTitleChange}
          onSubmitEditing={() => {
            setTitle(title.trim());
            descriptionRef.current.focus();
          }}
          onBlur={() => setTitle(title.trim())}
          placeholder="클럽 이름"
          returnKeyType="next"
          maxLength={20}
        />
        <Input
          ref={descriptionRef}
          label="클럽 설명"
          value={description}
          onChangeText={text => setDescription(text)}
          onSubmitEditing={() => {
            setDescription(description.trim());
            regionRef.current.focus();
          }}
          onBlur={() => setDescription(description.trim())}
          placeholder="클럽 설명"
          returnKeyType="next"
          maxLength={40}
        />
        <Input
          ref={regionRef}
          label="클럽 지역"
          value={region}
          onChangeText={text => setRegion(text)}
          onSubmitEditing={() => {
            setRegion(region.trim());
            maxNumberRef.current.focus();
          }}
          onBlur={() => setRegion(region.trim())}
          placeholder="클럽 지역"
          returnKeyType="next"
          maxLength={20}
        />
        <Input
          ref={maxNumberRef}
          label="클럽 최대 인원"
          value={maxNumber}
          onChangeText={_maxNumberChanged}
          onSubmitEditing={() => {
            _maxNumberChanged();
            _handelCreateButtonPress();
          }}
          placeholder="클럽 최대 인원"
          returnKeyType="done"
          maxLength={5}
          keyboardType="number-pad"
        />
        <ErrorText>{errorMessage}</ErrorText>
        <Button
          title="클럽 생성하기"
          onPress={_handelCreateButtonPress}
          disabled={disabled}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default ClubCreation;
