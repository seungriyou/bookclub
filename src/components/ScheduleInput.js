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
  font-size: 20px;
  border-radius: 4px;
  width: ${({ width }) => width - 40}px;
  textAlignVertical = "top";
  margin-bottom: 20px;
  height: 50px;
`;

const ScheduleInput = forwardRef(({ value, onChangeText, onSubmitEditing, placeholder, disabled }, ref ) => {
    const width = Dimensions.get('window').width;

    return (
        <StyledTextInput
          width={width}
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          editable={!disabled}

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
};

export default ScheduleInput;
