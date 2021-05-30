//focus, forwardRef가 있는 입력창 컴포넌트
import React, { forwardRef } from 'react';
import { Dimensions } from 'react-native'
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 10px 10px;
  font-size: 18px;
  border-radius: 4px;
  width: ${({ width }) => width - 40}px;
  margin-bottom: 20px;
  min-height: 60px;
`;

const ScheduleInput = forwardRef(({ value, onChangeText, multiline, onSubmitEditing, placeholder, disabled }, ref ) => {
    const width = Dimensions.get('window').width;

    return (
        <StyledTextInput
          width={width}
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          editable={!disabled}
          multiline={multiline}
          placeholder={placeholder}
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="none" // iOS only
          underlineColorAndroid="transparent" // Android only
        />
    );
  }
);

ScheduleInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  multiline: PropTypes.string,
};

export default ScheduleInput;
