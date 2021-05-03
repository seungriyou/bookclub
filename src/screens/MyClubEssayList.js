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

const MyClubEssayList = ({navigation}) => {

  const _handleEssayWriteButtonPressed = params => {
    navigation.navigate('MyClubEssay', params);
  }

  return (
    <Container>
      <Button
        title="에세이 올리기"
        onPress={_handleEssayWriteButtonPressed}
      />
    </Container>
  );
}

export default MyClubEssayList;
