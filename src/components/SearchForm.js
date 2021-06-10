// 게시판, 앨범, 에세이 탭에서 게시글을 글 제목 및 작성자 이름으로 검색할 때 사용되는 검색창 컴포넌트
// - 기본적으로 원형 검색 버튼이 우측 하단 탭 바 위에 고정적으로 위치함
// - 해당 버튼을 누르면 검색창이 확장되고 검색이 가능함

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  width: ${({ width }) => width - 95}px;
  margin: 8px 0;
  padding: 5px 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.search};
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;
const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0px 0px;
  borderTop-color: ${({theme})=>theme.separator};
  borderTop-width: 0.8px;
`;
const Container2 = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.background};
  borderTop-color: ${({theme})=>theme.separator};
  borderTop-width: 0.8px;
`;
const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background};
  padding: 8px 8px;
  margin: 5px 3px 3px 5px;
  position: absolute;
  right: 13;
  bottom: 13;
  border-radius: 30px;
  border-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
`;

const SearchForm = ({ placeholder, value, onChangeText, onChangeSearchOption, onSubmitEditing, onPress, clearSearch }) => {
  const width = Dimensions.get('window').width;
  const [isSearch, setIsSearch] = useState(false);
  const [searchOption, setSearchOption] = useState('title');

  const _switchSearch = () => {
    setIsSearch(!isSearch);
    clearSearch();
  };

  const _handleSearchOptionChange = (itemValue) => {
    onChangeSearchOption(itemValue);
    setSearchOption(itemValue);
  }

  return (
    <>
      {isSearch
        ?
        <Container2>
        <Picker
              selectedValue={searchOption}
              style={{ height: 30, width: 110, margin: 10 }}
              onValueChange={(itemValue, itemIndex) => _handleSearchOptionChange(itemValue)}>
              <Picker.Item label="제목" value="title" />
              <Picker.Item label="작성자" value="author" />
          </Picker>
        <Container>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            style={{ marginRight: 8, marginLeft: 10 }}
            color='#000000'
            onPress={_switchSearch}
          />
          <StyledInput
            width={width}
            placeholder={placeholder}
            maxLength={30}
            multiline={false}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
          />
          <MaterialIcons
            name="search"
            size={30}
            style={{ marginLeft: 12, marginRight: 10 }}
            color='#000000'
            onPress={onPress}
          />
        </Container>
        </Container2>
        :
        <ButtonContainer>
          <MaterialIcons
            name="search"
            size={30}
            color='#000000'
            onPress={_switchSearch}
          />
        </ButtonContainer>
      }
    </>
  )
};

SearchForm.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
};

export default SearchForm;
