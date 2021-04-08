import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Club = () => {
  return (
    <Container>
      <Text style={{ fontSize: 24 }}>Club</Text>
    </Container>
  );
};

export default Club;
