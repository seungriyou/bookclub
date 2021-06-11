//앱 내에서 이미지를 표현하는 컴포넌트 

import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

const Container = styled.View`
  align-self: center;
  margin-bottom: 30px;
`;

const StyledImage = styled.Image`
  background-color: ${({ theme }) => theme.imageBackground};
  width: 100px;
  height: 100px;
  border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;
`;

const ButtonContainer = styled.Pressable`
  background-color: ${({ theme }) => theme.imageButtonBackground};
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const ButtonIcon = styled(MaterialIcons).attrs({ //회원가입 프로필 설정시 사진을 받아오도록 하는 아이콘 버튼
  name: 'photo-camera',
  size: 22,
})`
  color: ${({ theme }) => theme.imageButtonIcon};
`;

const PhotoButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonIcon />
    </ButtonContainer>
  );
};

const Image = ({ url, imageStyle, rounded, showButton, onChangeImage }) => { //사용자에게 이미지를 불러오도록 하는 함수
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'ios') { //ios에선 사진첩 접근 권한이 필요하다
          const {status} = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
          );
          if (status !== 'granted') {
            Alert.alert(
              '알림',
              '사진첩에 접근할 권한이 필요합니다'
            );
          }
        }
      } catch (e) {
        Alert.alert('사진 권한 오류', e.message);
      }
    })();
  }, []);

  const _handleEditButton = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        onChangeImage(result.uri);
      }
    } catch (e) {
      Alert.alert('사진 불러오기 오류', e.message);
    }
  };

  return (
    <Container>
      <StyledImage source={{ uri: url }} style={imageStyle} rounded={rounded} />
      {showButton && <PhotoButton onPress={_handleEditButton} />}
    </Container>
  );
};

Image.defaultProps = {
  rounded: false,
  showButton: false,
  onChangeImage: () => {},
};

Image.propTypes = {
  uri: PropTypes.string,
  imageStyle: PropTypes.object,
  rounded: PropTypes.bool,
  showButton: PropTypes.bool,
  onChangeImage: PropTypes.func,
};

export default Image;
