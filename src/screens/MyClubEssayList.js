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
    navigation.navigate('MyClubEssayNav', {screen: 'MyClubEssay', params});
  };
  const _handleEssayViewButtonPressed = params => {
    navigation.navigate('MyClubEssayNav', {screen: 'MyClubEssayView'});
  };

  return (
    <Container>
      <Button
        title="에세이 올리기"
        onPress={_handleEssayWriteButtonPressed}
      />
      <Button
        title="게시글 보기"
        onPress={_handleEssayViewButtonPressed}
      />
    </Container>
  );
}

export default MyClubEssayList;
