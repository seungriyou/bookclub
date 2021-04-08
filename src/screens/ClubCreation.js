import React from 'react';
import styled from 'styled-components/native';
import { Text, Button } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ClubCreation = ({ navigation }) => {
  return (
    <Container>
      <Text style={{ fontSize: 24 }}>Club Creation</Text>
      <Button title="Club" onPress={() => navigation.navigate('Club')} />
    </Container>
  );
};

export default ClubCreation;
