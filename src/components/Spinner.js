//앱의 로딩상태에서 다른 컴포넌트들로 작업이 중복되어 일어나지 않도록 막는 상태 

import React, { useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  z-index: 2;
  opacity: 0.3;
  width: 100%;
  height: 100%;
  justify-content: center;
  background-color: ${({ theme }) => theme.spinnerBackground};
`;

const Spinner = () => {
  const theme = useContext(ThemeContext);
  return (
    <Container>
      <ActivityIndicator size={'large'} color={theme.spinnerIndicator} />
    </Container>
  );
};

export default Spinner;
