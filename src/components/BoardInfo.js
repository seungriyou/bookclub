//게시판 조회 화면에서 사용되는 컴포넌트 - 작성자, 작성날짜, 댓글 수, 제목, 내용 표기

import React from 'react';
import styled from 'styled-components/native';
import {Dimensions, StyleSheet, Text} from 'react-native';
import { theme } from '../theme';

const Container=styled.View`
    width: ${({ width }) => width - 40}px;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background-color: ${({ theme }) => theme.inputBackground};
    margin: 20px 0 0 0;
    padding: 15px 15px;
    border-radius: 10px;
`;

const PostInfo = styled.View`
  width: ${({ width }) => (width - 40) * 0.92}px;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 6px;
  padding-bottom: 2px;
  margin: 0px;
`;

const PostInfo2 = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const Containerfortitle=styled.View`
    padding: 5px 0 15px 0;
    border-radius: 0;
    justify-content: center;
    multi-line: {true};
    flex-direction: column;
    background-color: ${({theme})=>theme.inputBackground};
    color: ${({theme})=>theme.text};
`;

const Containerforcontent=styled.ScrollView`
    min-height: 300px;
    padding: 10px 10px 0 0;
    border-radius: 0;
    multi-line: {true};
    flex-direction: column;
    background-color: ${({theme})=>theme.inputBackground};
    color: ${({theme})=>theme.text};
`;

const Line=styled.View`
    width: ${({ width }) => (width - 40)*0.92}px;
    height: 0.9px;
    background-color: ${({theme})=>theme.separator};
`;


const BoardViewPost=({title, content, writer, writedate, reply})=>{
    const width=Dimensions.get('window').width;

    return(
        <Container width={width}>
            <Containerfortitle>
                <Text style={styles.titleText}>{title}</Text>
            </Containerfortitle>
        <Line width={width} />
        <PostInfo width={width}>
            <Text style={styles.infoText}>작성자: {writer}</Text>
        <PostInfo2>
            <Text style={styles.infoText}>{writedate}</Text>
            <Text style={styles.infoText}>   댓글 {reply}</Text>
        </PostInfo2>
      </PostInfo>            
        <Line width={width} />
            <Containerforcontent>
            <Text style={styles.contentText}>{content}</Text>
            </Containerforcontent>
        </Container>
    )
}

const styles = StyleSheet.create({
    titleText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    infoText: {
      fontSize: 13,
      color: theme.infoText,
      paddingBottom: 5,
    },
    contentText: {
      fontSize: 16,
      lineHeight: 25,
    },
});


export { BoardViewPost };
