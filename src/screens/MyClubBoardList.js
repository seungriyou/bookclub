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


const MyClubBoardList = ({navigation, route}) => {
  const id = route.params?.id;
  const title = route.params?.title;

  const _handleBoardWriteButtonPressed = params => {
    navigation.navigate('MyClubBoardNav', {screen: 'MyClubBoard', params: {id: id, title: title}});
  }

  return (
    <Container>
      <Button
        title="글 작성하기"
        onPress={_handleBoardWriteButtonPressed}
      />
    </Container>
  );
}

export default MyClubBoardList;
