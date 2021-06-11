import React, { useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text, Alert } from 'react-native';
import { Button, Image, Input } from '../components';
import { logout, getCurrentUser, updateUserPhoto } from '../utils/firebase';
import { UserContext, ProgressContext } from '../contexts';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const Profile = () => {
  const { dispatch } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);
  const theme = useContext(ThemeContext);

  const user = getCurrentUser();
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);

  const _handleLogoutButtonPress = async () => {
    try {
      spinner.start();
      await logout();
    } catch (e) {
      console.log('[Profile] logout: ', e.message);
    } finally {
      dispatch({});
      spinner.stop();
    }
  };

  const _handlePhotoChange = async url => {
    try {
      spinner.start();
      const updateUser = await updateUserPhoto(url); //util/firebase의 updateUserPhoto함수 호출 
      setPhotoUrl(updateUser.photoUrl);
    } catch (e) {
      Alert.alert('사진 수정 오류', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <Container>
    <Image
      url={photoUrl}
      onChangeImage={_handlePhotoChange}
      showButton
      rounded
    />
      <Input label="이름" value={user.name} disabled />
      <Input label="이메일" value={user.email} disabled />
      <Button
        title="로그아웃"
        onPress={_handleLogoutButtonPress}
        containerStyle={{ marginTop: 30, backgroundColor: theme.buttonLogout }}
      />
    </Container>
  );
};

export default Profile;
