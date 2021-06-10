//일정 작성 화면에서 사용되는 styled가 적용된 버튼 컴포넌트

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Dimensions} from 'react-native';

const TRANSPARENT = 'transparent';



const Container = styled.Pressable`
  background-color: ${({ theme, isFilled }) =>
    isFilled ? theme.background : TRANSPARENT};
  align-items: center;
  border-radius: 4px;
  width: ${({ width }) => width - 40}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  height: 60px;
`;

const Title = styled.Text`
  height: 30px;
  font-size: 20px;
  color: ${({ theme, isFilled }) =>
    isFilled ? theme.buttonBackground : theme.background};
  marginTop: 13px;
`;

const Button = ({ containerStyle, title, onPress, isFilled, disabled }) => {
  const width = Dimensions.get('window').width;

  return (
    <Container
      width={width}
      style={containerStyle}
      onPress={onPress}
      isFilled={isFilled}
      disabled={disabled}
    >
      <Title isFilled = {isFilled}>{title}</Title>
    </Container>
  );
};

Button.defaultProps = {
  isFilled: true,
};

Button.propTypes = {
  containerStyle: PropTypes.object,
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  isFilled: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default Button;
