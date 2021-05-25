import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions, Text } from 'react-native';
import { Input, Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProgressContext } from '../contexts';
import { createClub, getCurrentUser } from '../utils/firebase';
import {Picker} from '@react-native-picker/picker';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: flex-start;
  padding: 0 20px;
`;

const ContainerRegion=styled.View`
    width: ${({width})=>(width)-40}px;
    height: 70px;
    background-color: ${({theme})=>theme.background};
    align-items: flex-start;
    justify-content: center;
    border-Width: 1px;
    border-Color: ${({theme})=>theme.inputBorder};
    padding: 10px 0 10px 0;
    marginTop: 20px;
    marginBottom: 10px;
    border-radius: 5px;
`;

const Box=styled.View`
  width: 10px;
  height: 10px;
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

  const width = Dimensions.get('window').width;

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
            maxNumberRef.current.focus();
          }}
          onBlur={() => setDescription(description.trim())}
          placeholder="클럽 설명"
          returnKeyType="next"
          maxLength={150}
        />

        <ContainerRegion width={width}>
          <Picker
              selectedValue={region}
              style={{ height: 50, width: 220}}
              onValueChange={(itemValue, itemIndex) => setRegion(itemValue)}>
              <Picker.Item label="지역을 선택해주세요" value="" />
              <Picker.Item label="강서" value="강서" />
              <Picker.Item label="강북" value="강북" />
              <Picker.Item label="강남" value="강남" />
              <Picker.Item label="강동" value="강동" />
              <Picker.Item label="경기북부" value="경기북부" />
              <Picker.Item label="경기남부" value="경기남부" />
              <Picker.Item label="충청" value="충청" />
              <Picker.Item label="전라" value="전라" />
              <Picker.Item label="경북" value="경북" />
              <Picker.Item label="경남" value="경남" />
              <Picker.Item label="제주" value="제주" />
          </Picker>
        </ContainerRegion>

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
        <Box />
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
