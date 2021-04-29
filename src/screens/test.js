import React from 'react';
import {Button} from 'react-native';
import styled, {ThemeProvider} from 'styled-components/native';
import {theme} from '../theme';

const Container=styled.View`
    flex: 1;
    background-color: ${({theme})=>theme.background};
    align-items: center;
    justify-content: center;
`;

const StyledText=styled.Text`
    font-size: 30px;
    margin-bottom: 10px;
`;

const test=({navigation})=>{
    return(
        <ThemeProvider theme ={theme}>
            <Container>
                <StyledText>test</StyledText>
                <Button title="this is test" onPress={()=>navigation.navigate('boardwrite')} />
            </Container>
        </ThemeProvider>
    );
};

export default test; 