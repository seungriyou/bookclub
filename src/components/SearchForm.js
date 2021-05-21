import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';


const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  width: ${({ width }) => width - 95}px;
  margin: 8px 0;
  padding: 3px 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.search};
  font-size: 15px;
  color: ${({ theme }) => theme.text};
`;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0px 10px;
  margin: 0 0;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background};
  padding: 8px 8px;
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 30px;
  border-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
`;

const SearchForm = ({ placeholder, value, onChangeText, onSubmitEditing, onPress, clearSearch }) => {
  const width = Dimensions.get('window').width;
  const [isSearch, setIsSearch] = useState(false);
  
  const _switchSearch = () => {
    setIsSearch(!isSearch);
    clearSearch();
  };

  return (
    <>
      {isSearch
        ?
        <Container>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            style={{ marginRight: 8 }}
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
            size={27}
            style={{ marginLeft: 12 }}
            color='#000000'
            onPress={onPress}
          />
        </Container>
        :
        <ButtonContainer>
          <MaterialIcons
            name="search"
            size={25}
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