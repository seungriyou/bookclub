//새로운 클럽을 생성하는 클럽 생성 화면
//클럽 이름/소개글/지역/최대인원을 picker 또는 input 컴포넌트로 입력 가능하며, 입력 누락 시 클럽 생성 버튼이 비활성화됩니다.
//모든 값을 입력 후 버튼을 눌러 클럽을 생성합니다.

import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions, Text } from 'react-native';
import { Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProgressContext } from '../contexts';
import { createClub, getCurrentUser } from '../utils/firebase';
import {Picker} from '@react-native-picker/picker';
import CCInput from '../components/CCInput';

const List = styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const Con=styled.View`
flex: 1;
background-color: ${({theme})=>theme.background};
`;

const Container=styled.View`
  flex: 1;
  width: ${({width})=>(width)}px;
  
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({theme})=>theme.background};
  paddingTop: 40px;
  paddingLeft: 0px;
`;

const Fix=styled.View`
  flex-direction: column;
  justify-content: flex-start;
`;

const ContainerInput=styled.View`
    width: ${({width})=>(width)-40}px;
    min-height: 70px;
    background-color: ${({theme})=>theme.background};
    align-items: flex-start;
    justify-content: center;
    border-Width: 0.8px;
    border-Color: ${({theme})=>theme.text};
    padding: 10px 0px 10px 10px;
    marginTop: 10px;
    marginBottom: 25px;
    border-radius: 5px;
`;

const ContainerRegion=styled.View`
    width: ${({width})=>(width)-40}px;
    height: 70px;
    background-color: ${({theme})=>theme.background};
    align-items: flex-start;
    justify-content: center;
    border-Width: 0.8px;
    border-Color: ${({theme})=>theme.text};
    padding: 10px 0 10px 0;
    marginTop: 10px;
    marginBottom: 30px;
    border-radius: 5px;
`;

const Box=styled.View`
  width: 10px;
  height: 10px;
`;

const BigBox=styled.View`
  width: 10px;
  height: 40px;
`;

const ErrorText = styled.Text`
  color: ${({theme})=>theme.errorText};
  paddingBottom: 10px;
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
    setDisabled(title.trim() === '' || region === '' || isNaN(parseInt(maxNumber)) || description.trim() === '');
  }, [title, description, region, maxNumber, errorMessage]);

  const _handelTitleChange = title => {
    setTitle(title);
    setErrorMessage(title.trim() ? '' : '클럽 이름을 입력해주세요');
  };

  const _maxNumberChanged = maxNumber => {

    if (isNaN(parseInt(maxNumber))) {
      setErrorMessage('클럽의 최대 인원은 2 ~ 99사이의 숫자로 입력해주세요');
    }
    else if (parseInt(maxNumber) > 100 || parseInt(maxNumber) < 1) {
      setErrorMessage('클럽의 최대 인원은 2 ~ 99사이로 입력해주세요');
    }
    else {
      setErrorMessage('');
    }
    setMaxNumber(parseInt(maxNumber));

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
      extraScrollHeight = {30}
    >
      <Con>
      <List width={width}>
      <Container width={width}>
      
        <Fix>
        <Text>클럽 이름</Text>
        <ContainerInput width={width}>
          <CCInput
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
        </ContainerInput>
        </Fix>
        <Fix>
        <Text>클럽 소개글</Text>
        <ContainerInput width={width}>
          <CCInput
            placeholder="클럽 소개글"
            maxLength={150}
            multiline={true}
            returnKeyType= "next"
            ref={descriptionRef}
            value={description}
            onBlur={() => setDescription(description.trim())}
            onChangeText={text=>setDescription(text)}
          />
        </ContainerInput>
        </Fix>
        <Fix>
        <Text>클럽 지역</Text>
        <ContainerRegion width={width}>
          <Picker
              selectedValue={region}
              style={{ height: 50, width: 220, marginLeft: 5}}
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
        </Fix>
        <Fix>
        <Text>클럽 최대 인원</Text>
        <ContainerInput width={width}>
          <CCInput
            ref={maxNumberRef}
            value={maxNumber}
            onChangeText={(num) => _maxNumberChanged(num)}
            onSubmitEditing={() => {
              _maxNumberChanged();
              _handelCreateButtonPress();
            }}
            placeholder="클럽 최대 인원"
            returnKeyType="done"
            maxLength={5}
            keyboardType="number-pad"
          />
        </ContainerInput>
        </Fix>

        <ErrorText>{errorMessage}</ErrorText>

        <Box />
        <Button
          title="클럽 생성하기"
          onPress={_handelCreateButtonPress}
          disabled={disabled}
        />
        <BigBox />
        
      </Container>
      </List>
      </Con>
    </KeyboardAwareScrollView>
  );
};

export default ClubCreation;
