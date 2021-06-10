// 앨범 탭에서 게시글을 작성 시 제목을 입력하는 데에 사용되는 컴포넌트 

import React from 'react';
import styled from 'styled-components/native';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  width: ${({ width }) => width - 40}px;
  height: 58px;
  margin: 20px 0;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.inputBackground};
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
`;

const AlbumTitleInput = ({ placeholder, value, onChangeText }) => {
  const width = useWindowDimensions().width;

  return <StyledInput
    width={width}
    placeholder={placeholder}
    maxLength={50}
    autoCapitalize="none"
    autoCorrect={false}
    returnKeyType="next"
    value={value}
    onChangeText={onChangeText}
  />;
};

AlbumTitleInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};

export default AlbumTitleInput;