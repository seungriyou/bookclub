import React from 'react';
import styled from 'styled-components/native';
import { Text, Button } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ClubList = ({ navigation }) => {
  return (
    <Container>
      <Text style={{ fontSize: 24 }}>ClubList</Text>
      <Button
        title="Club Creation"
        onPress={() => navigation.navigate('Club Creation')}
      />
    </Container>
  );
};

export default ClubList;
