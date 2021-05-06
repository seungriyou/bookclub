//변경사항 -> theme.js에 따른 컬러 변경 + 오타 수정

import React, {forwardRef} from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';

const StyledInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    width: ${({width})=>width-40}px;
    height: 50px;
    margin: 20px 0;
    padding: 10px 10px;
    border-radius: 10px;
    background-color: ${({theme})=>theme.inputBackground};
    font-size: 20px;
    color: ${({theme})=>theme.text};
    textAlignVertical="top";
`;

const TitleInput= forwardRef(({placeholder, value, onChangeText, onSubmitEditing},ref)=>{
    const width = Dimensions.get('window').width;
    
    return <StyledInput 
        width={width} 
        placeholder={placeholder} 
        maxLength={30}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType= "next"
        
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        />
}
);

TitleInput.propTypes={
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
};

export default TitleInput;
