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

const MyClubScheduleList = ({navigation}) => {
  const _handleScheduleWriteButtonPressed = params => {
    navigation.navigate('MyClubScheduleNav', {screen: 'MyClubSchedule'});
  }

  return (
    <Container>
      <Button
        title="일정 작성하기"
        onPress={_handleScheduleWriteButtonPressed}
      />
    </Container>
  );
}

export default MyClubScheduleList;
