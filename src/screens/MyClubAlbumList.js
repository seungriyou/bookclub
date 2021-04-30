import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, FlatList, Text, Modal } from 'react-native';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const _handleAlbumWriteButtonPressed = params => {
  navigation.navigate('MyClubAlbum', params);
}

const MyClubAlbumList = ({navigation}) => {
  return (
    <Container>
      <Button
        title="사진 올리기"
        onPress={_handleAlbumWriteButtonPressed}
      />
    </Container>
  );
}

export default MyClubAlbumList;
