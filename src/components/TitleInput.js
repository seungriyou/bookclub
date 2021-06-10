//게시판 작성 화면에서 사용되는 styled이 적용된 제목 input 컴포넌트
//타 게시판(앨범/에세이)화면에서 사용되느 제목 input 컴포넌트와 동일하게 동작합니다.

import React, {forwardRef} from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';

const StyledInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    width: ${({width})=>width-40}px;
    height: 58px;
    margin: 20px 0;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: ${({theme})=>theme.inputBackground};
    font-size: 18px;
    color: ${({theme})=>theme.text};
`;

const TitleInput= forwardRef(({placeholder, value, onChangeText, onSubmitEditing},ref)=>{
    const width = Dimensions.get('window').width;

    return <StyledInput
        width={width}
        placeholder={placeholder}
        maxLength={50}
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
