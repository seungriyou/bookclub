//MyClubBoardView화면에서 사용될 댓글 input component
//파이어베이스 연동이 되어있지 않습니다.


import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {MaterialCommunityIcons} from '@expo/vector-icons';


const StyledInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    width: ${({width})=>width-60}px;
    margin: 20px 0;
    min-height: 50px;
    padding: 5px 10px;
    border-radius: 10px;
    background-color: ${({theme})=>theme.appBackground};
    font-size: 16px;
    color: ${({theme})=>theme.text};
    textAlignVertical="top";
`;

const Container=styled.View`
    flex-direction: row;
    align-items: center;
    background-color: ${({theme})=>theme.background};
    padding: 0px 10px;
    margin: 0 0;
`;


const ReplyInput= ({placeholder, value, onChangeText, onSubmitEditing, onPress})=>{
    const width = Dimensions.get('window').width;

    return (
        <Container>
        <StyledInput 
            width={width} 
            placeholder={placeholder} 
            maxLength={100}
            multiline={true}
            autoCapitalize="none"
            autoCorrect={false}
            
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
        />
        <MaterialCommunityIcons
            name="pencil"
            size={30}
            style={{marginLeft:13}}
            color= '#000000'
            onPress={onPress}
        />
        </Container>
    )
};

ReplyInput.propTypes={
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
};

export default ReplyInput;