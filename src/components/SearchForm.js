import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';


const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  width: ${({ width }) => width - 150}px;
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
        <Container>
          <Picker
              selectedValue={searchOption}
              style={{ height: 50, width: 110, margin: 10 }}
              onValueChange={(itemValue, itemIndex) => _handleSearchOptionChange(itemValue)}>
              <Picker.Item label="제목" value="title" />
              <Picker.Item label="작성자" value="author" />
          </Picker>
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
