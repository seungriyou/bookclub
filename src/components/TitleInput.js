//게시판 제목 INPUT Component

import React from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';

const StyledInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.text2,
}))`
    width: ${({width})=>width-40}px;
    height: 50px;
    margin: 20px 0;
    padding: 10px 10px;
    border-radius: 10x;
    border-radius: 10px;
    background-color: ${({theme})=>theme.white};
    font-size: 20px;
    color: ${({theme})=>theme.text1};
    textAlignVertical="top";
`;

const TitleInput= ({placeholder, value, onChangeText})=>{
    const width = Dimensions.get('window').width;
    
    return <StyledInput 
        width={width} 
        placeholder={placeholder} 
        maxLength={30}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType= "next"
        
        value={value}
        onChangeText={onChangeText}
        />
};

TitleInput.propTypes={
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
};

export default TitleInput;