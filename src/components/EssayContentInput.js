import React, { useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Image, useWindowDimensions, ActivityIndicator,	StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import EssayTextContentInput from './EssayTextContentInput';
import { theme } from '../theme';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {GOOGLE_CLOUD_VISION_API_KEY} from "../../secret.js";

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
const ConvertButtonIcon = () => {
  return (
    <MaterialCommunityIcons
      name="ocr"
      size={30}
      color={theme.buttonIcon}
    />
  );
};
const ConvertButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress}>
      <ConvertButtonIcon />
    </ButtonContainer>
  );
};

const EssayContentInput = ({ OCRValue, onChangeOCRText, contentValue, onChangeContentText }) => {
  const width = useWindowDimensions().width;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [googleResponse, setGoogleResponse] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);
  
  useEffect(() => {
    onChangeOCRText(googleResponse);
  }, [googleResponse]);

  const _takePhoto = async () => {
		let pickerResult = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
      saveToPhotos: true,
      base64: true,
		});
    if (!pickerResult.cancelled) {
      setImage(pickerResult.base64);
      setIsImageSelected(true);
    }
	};
  const _pickImage = async () => {
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
      base64: true,
		});
    if (!pickerResult.cancelled) {
      setImage(pickerResult.base64);
      setIsImageSelected(true);
    }
	};
  const submitToGoogle = async () => {
		try {
			setUploading(true);
			let body = JSON.stringify({
				requests: [
					{
            image: {
							content: image,
						},
						features: [
							{ type: 'TEXT_DETECTION' },
						]
					}
				]
			});
			await fetch(
				'https://vision.googleapis.com/v1/images:annotate?key=' +
					GOOGLE_CLOUD_VISION_API_KEY,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: body
				}).then((response) => {
          return response.json()
        }).then((responseJson) => {
          //console.log(responseJson.responses[0].fullTextAnnotation.text);
          setGoogleResponse(responseJson.responses[0].fullTextAnnotation.text);
        }).then(() => {
          setUploading(false);
          setIsImageSelected(false);
        });
		} catch (error) {
			console.log(error);
      alert('다시 시도해주세요.');
		}
	};
  const _maybeRenderUploadingOverlay = () => {
    if (uploading) {
      return (
        <View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: 'rgba(0,0,0,0.4)',
							alignItems: 'center',
							justifyContent: 'center'
						}
					]}
				>
					<ActivityIndicator color="#fff" animating size="large" />
				</View>
      );
    }
  };

  return (
    <KeyboardAwareScrollView>
      <Container width={width}>
        {!image || <Image 
          resizeMode="contain"
          style={{ width: width-60, height: 280 }} 
          source={{ uri: 'data:image/jpg;base64,'+image }} />}
        <ImageContainer width={width}>
          <PhotoButton onPress={_takePhoto} />
          <AlbumButton onPress={_pickImage} />
          {!isImageSelected || <ConvertButton onPress={submitToGoogle} />}
          {_maybeRenderUploadingOverlay()}
        </ImageContainer>
        <EssayTextContentInput
          placeholder="OCR 추출 내용"
          value={OCRValue}
          onChangeText={onChangeOCRText}
        />
        <EssayTextContentInput
          placeholder="내용 입력도 가능합니다."
          value={contentValue}
          onChangeText={onChangeContentText}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

EssayContentInput.propTypes = {
  OCRValue: PropTypes.string.isRequired,
  onChangeOCRText: PropTypes.func.isRequired,
  contentValue: PropTypes.string,
  onChangeContentText: PropTypes.func.isRequired,
};

export default EssayContentInput;