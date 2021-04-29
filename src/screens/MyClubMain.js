import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const MyClubMain = () => {
  const theme = useContext(ThemeContext);

  return (
    <Container>
      <Text>Test Main Screen</Text>
    </Container>
  );
};

export default MyClubMain;
