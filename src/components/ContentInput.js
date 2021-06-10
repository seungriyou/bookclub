//게시판 작성 화면에서 사용되는 내용 항목 input 컴포넌트
//여러줄 입력이 가능하며, 타 작성 게시판(앨범/에세이)에서 사용되는 input 컴포넌트와 동작 동일합니다.

import React, {forwardRef} from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';

 
const StyledInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    width: ${({width})=>width-40}px;
    height: 500px;
    margin: 0 0;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: ${({theme})=>theme.inputBackground};
    font-size: 16px;
    line-height: 25px;
    color: ${({theme})=>theme.text};
`;

const ContentInput=forwardRef(({placeholder, value, onChangeText, onSubmitEditing},ref)=>{
    const width = Dimensions.get('window').width;
    return <StyledInput 
        width={width} 
        placeholder={placeholder}
        maxLength={10000}
        multiline={true}
        textAlignVertical= 'top'
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType= "done"

        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        />;
}
);

ContentInput.propTypes={
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
};

export default ContentInput;
