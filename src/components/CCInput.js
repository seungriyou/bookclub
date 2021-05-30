import React, {forwardRef} from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';

 
const StyledInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    width: ${({width})=>width-60}px;
    margin: 0px 0;
    padding: 0px 0px;
    border-radius: 5px;
    background-color: ${({theme})=>theme.inputBackground};
    font-size: 16px;
    color: ${({theme})=>theme.text};
`;

const CCInput=forwardRef(({placeholder, value, onChangeText, onBlur, onSubmitEditing},ref)=>{
    const width = Dimensions.get('window').width;
    return <StyledInput 
        width={width} 
        placeholder={placeholder}
        maxLength={150}
        multiline={true}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType= "next"

        ref={ref}
        value={value}
        onBlur={onBlur}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        />;
}
);

CCInput.propTypes={
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func,
    onBlur: PropTypes.func,
};

export default CCInput;
