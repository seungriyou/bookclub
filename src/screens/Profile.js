import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { Button } from '../components';
import { logout } from '../utils/firebase';
import { UserContext } from '../contexts';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Profile = () => {
  const { dispatch } = useContext(UserContext);

  const _handleLogoutButtonPress = async () => {
    try {
      await logout();
    } catch (e) {
      console.log('[Profile] logout: ', e.message);
    } finally {
      dispatch({});
    }
  };

  return (
    <Container>
      <Button title="로그아웃" onPress={_handleLogoutButtonPress} />
    </Container>
  );
};

export default Profile;
