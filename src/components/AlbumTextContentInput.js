import React from 'react';
import styled from 'styled-components/native';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
    multiline: true,
    maxHeight: 230,
}))`
    width: ${({ width }) => width - 60}px;
    margin: 0px 0;
    padding: 10px 15px;
    background-color: ${({ theme }) => theme.inputBackground};
    font-size: 16px;
    color: ${({ theme }) => theme.text};
`;

const AlbumTextContentInput = ({ placeholder, value, onChangeText }) => {
    const width = useWindowDimensions().width;

    return <StyledInput 
        width={width} 
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
    />;
};

AlbumTextContentInput.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
};

export default AlbumTextContentInput;