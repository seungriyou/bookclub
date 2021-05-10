import React from 'react';
import styled from 'styled-components/native';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const TextContainer = styled.View`
  width: ${({ width }) => width - 40}px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-top-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
`;

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
  multiline: true,
  maxHeight: 180,
  textAlignVertical: 'top'
}))`
  width: ${({ width }) => width - 60}px;
  height: 180px;
  margin: 0px 0;
  padding: 0px 10px;
  padding-top: 15px;
  padding-bottom: 5px;
  background-color: ${({ theme }) => theme.inputBackground};
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.text};
`;

const EssayTextContentInput = ({ placeholder, value, onChangeText }) => {
  const width = useWindowDimensions().width;

  return (
    <TextContainer width={width}>
      <StyledInput
        width={width}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
      />
    </TextContainer>   
  );
};
/*
EssayTextContentInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};
*/
export default EssayTextContentInput;