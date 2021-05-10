import React, { useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Image, ScrollView, useWindowDimensions,  
  ActivityIndicator,
	Button,
	Clipboard,
	FlatList,
	Share,
	StyleSheet,
	Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import EssayTextContentInput from './EssayTextContentInput';
import { theme } from '../theme';
//import * as Permissions from 'expo-permissions';
//import uuid from 'react-native-uuid';
//import {GOOGLE_CLOUD_VISION_API_KEY} from "../../secret.js";
import * as ImagePicker from 'expo-image-picker';


const Container = styled.View`
  width: ${({ width }) => width - 40}px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.inputBackground};
  margin: 0px;
  padding: 5px 5px;
  border-radius: 10px;
`;
const ImageContainer = styled.View`
  width: ${({ width }) => width - 40}px;
  flex-direction: row;
  justify-content: space-around;
`;
const ButtonContainer = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
`;
const PhotoButtonIcon = () => {
  return (
      <MaterialIcons
          name="camera-alt"
          size={25}
          color={theme.buttonIcon}
      />
  );
};
const PhotoButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress} >
      <PhotoButtonIcon />
    </ButtonContainer>
  );
};
const AlbumButtonIcon = () => {
  return (
      <MaterialIcons
          name="collections"
          size={25}
          color={theme.buttonIcon}
      />
  );
};
const AlbumButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress} >
      <AlbumButtonIcon />
    </ButtonContainer>
  );
};


const EssayContentInput = ({ onPress, photos, text, onChangeText }) => {
  const width = useWindowDimensions().width;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [googleResponse, setGoogleResponse] = useState(null);
  
  /* Google Cloud Vision API 및 카메라 & 앨범 Image Picker 동작 */
  const _takePhoto = async () => {
		let pickerResult = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
      saveToPhotos: true,
		});
    console.log(`_takePhoto:\n${pickerResult.uri}`);    
		//_handleImagePicked(pickerResult);
    //submitToGoogle();
	};
  const _pickImage = async () => {
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
		});
    console.log(`_pickImage:\n${pickerResult.uri}`);
		//_handleImagePicked(pickerResult);
    //submitToGoogle();
	};

  return (
    <KeyboardAwareScrollView>
      <Container width={width}>
        <ImageContainer width={width}>
          <PhotoButton onPress={_takePhoto} />
          <AlbumButton onPress={_pickImage} />
        </ImageContainer>
        <EssayTextContentInput
          placeholder="OCR 추출 내용"
          value={text}
          onChangeText={() => {}}
        />
        <EssayTextContentInput
          placeholder="내용 입력도 가능합니다."
          value={text}
          onChangeText={() => {}}
        />
      </Container>
    </KeyboardAwareScrollView>
  );

};
/*
EssayContentInput.propTypes = {
  onPress: PropTypes.func.isRequired,
  photos: PropTypes.array.isRequired,
  text: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
};
*/
export default EssayContentInput;