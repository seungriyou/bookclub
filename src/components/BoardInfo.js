//MyClubBoardView화면의 제목, 작성자 및 일자, 내용 component
//파이어베이스 연동이 되어있지 않습니다.

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Dimensions} from 'react-native';


const Containerforinfo=styled.View`
    width: ${({width})=>width-40}px;
    height: 40px;
    margin: 0 0 0 0;
    padding: 5px 10px;
    align-items: center;
    justify-content: flex-start;
    border-radius: 0;
    flex-direction: row;
    background-color: ${({theme})=>theme.inputBackground};
    color: ${({theme})=>theme.text};
`;

const Containerfortitle=styled.View`
    width: ${({width})=>width-40}px;
    margin: 20px 20px 0 0;
    min-height: 50px;
    padding: 10px;
    border-radius: 0;
    justify-content: flex-start;
    multi-line: {true};
    flex-direction: column;
    background-color: ${({theme})=>theme.inputBackground};
    color: ${({theme})=>theme.text};
`;

const Containerforcontent=styled.ScrollView`
    width: ${({width})=>width-40}px;
    margin: 0 0 0 0;
    min-height: 300px;
    padding: 5px 10px 20px 10px;
    border-radius: 0;
    multi-line: {true};
    flex-direction: column;
    background-color: ${({theme})=>theme.inputBackground};
    color: ${({theme})=>theme.text};
`;

const Writer=styled.Text`
    flex:8;
    font-size: 15px;
    color: ${({theme})=>theme.text};
`;

const WriteDate=styled.Text`
    flex:2;
    font-size: 15px;
    color: ${({theme})=>theme.text};
`;

const Reply=styled.Text`
    flex:1;
    font-size: 15px;
    color: ${({theme})=>theme.text};
`;

const Title=styled.Text`
    flex: 1;
    font-size: 20px;
    color: ${({theme})=>theme.text};

`;

const Content=styled.Text`
    flex: 1;
    font-size: 20px;
    flex-direction: column;
    line-height: 30px;
    color: ${({theme})=>theme.text};
`;

const BoardTitle=({title})=>{
    const width= Dimensions.get('window').width;

    return(
        <Containerfortitle width={width}>
            <Title>{title}</Title>
        </Containerfortitle>
    );
};

const BoardContent=({content})=>{
    const width= Dimensions.get('window').width;
    return(
        <Containerforcontent width={width} >
            <Content>{content}</Content>
        </Containerforcontent>
    );
};

const BoardInfo=({writer, writedate, reply})=>{
    const width= Dimensions.get('window').width;

    return(
        <Containerforinfo width={width}>
            <Writer>{writer}</Writer>
            <WriteDate>{writedate}</WriteDate>
            <Reply>{reply}</Reply>

        </Containerforinfo>
    );
};

export { BoardTitle, BoardContent, BoardInfo};
