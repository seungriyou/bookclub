// 에세이 탭에서 게시글을 작성 시 OCR 텍스트 변환 및 본문을 입력하는 데에 사용되는 컴포넌트
// - 본문 텍스트 입력 시에 사용하는 EssayTextContentInput 컴포넌트를 포함함
// - Google Cloud Vision API와 직접 구현한 OCR 후처리 API를 사용하여 OCR 텍스트 추출 기능을 구현함

import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Image, useWindowDimensions, ActivityIndicator,	StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import EssayTextContentInput from './EssayTextContentInput';
import { theme } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import { GOOGLE_CLOUD_VISION_API_KEY } from "../../secret.js";

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

  // 카메라를 열어 새로운 사진을 찍는 함수
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

  // 로컬 앨범에 접근하여 사진을 가져오는 함수
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

  // Google Cloud Vision API와 OCR 후처리 API를 사용하여 사진으로부터 텍스트를 추출하는 함수
  const submitToGoogle = () => {
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
			fetch (
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
          setGoogleResponse(responseJson.responses[0].fullTextAnnotation.text);
          try {
            fetch (
              'https://bookclub-ocr.du.r.appspot.com/process',
              {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                  lang: responseJson.responses[0].fullTextAnnotation.pages[0].property.detectedLanguages[0].languageCode,
                  text: responseJson.responses[0].fullTextAnnotation.text + ' '
                })
              }).then((response) => {
                console.log(JSON.stringify(response));
                return response.json();
              }).then((responseJson) => {
                console.log(responseJson);
                setGoogleResponse(responseJson.text_checked);
              }).then(() => {
                setUploading(false);
                setIsImageSelected(false);
              });
            } catch (error) {
              setUploading(false);
              console.log(error);
            }
        });
		} catch (error) {
      setUploading(false);
			console.log(error);
      alert('다시 시도해주세요.');
		}
	};

  // OCR 변환 시 버튼 영역에 Activity Indicator를 출력하는 함수
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
          placeholder="에세이 작성 시 저작권 상 책의 저자, 제목, 출판사, 해당 글귀가 위치한 페이지의 명시가 필요합니다."
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
