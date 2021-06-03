import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled.Pressable`
  background-color: ${({ theme }) => theme.appBackground}
  align-items: center;
  border-radius: 5px;
  min-width: 40px;
  padding: 10px;
  margin: 0 35px 0 35px;
`;


const Title = styled.Text`
  font-size: 14px;
  color: #ffffff;
`;

const RCButton = ({ containerStyle, title, onPress }) => {

  return (
    <Container
      style={containerStyle}
      onPress={onPress} >
      <Title>{title}</Title>
    </Container>
  );
};


RCButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
}



export default RCButton;
