import React, {useLayoutEffect, useState, useRef} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import TitleInput from '../components/TitleInput';
import ContentInput from '../components/ContentInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const Container=styled.View`
    flex: 1;
    background-color: ${({theme})=>theme.buttonBackground};
    align-items: center;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width-40}px;
`;


const BoardWrite=({navigation})=>{

    const width= Dimensions.get('window').width;

    const refTitle=useRef();
    const refContent=useRef();

    const [newTitle, setNewTitle]=useState('');
    const [newContent, setNewContent]=useState('');

    const _handleTitleChange=text=>{
        setNewTitle(text);
    }
    const _handleContentChange=text=>{
        setNewContent(text);
    }

    const _handelCompleteButtonPress=async()=>{ //상단바 글 등록 버튼에 사용되는 함수 -> 이벤트 처리 필요 
        alert(`check console`)
        console.log("연동 함수 필요");
    }

    useLayoutEffect(()=>{       
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
            headerLeft: ({onPress, tintColor})=>{   
                return(
                    <MaterialCommunityIcons
                        name="keyboard-backspace"
                        size={30}
                        style={{marginLeft:11}}
                        color={tintColor}
                        onPress={onPress}
                    />
                );
            },
            headerRight: ({tintColor})=>(
                <MaterialCommunityIcons
                    name="check"
                    size={30}
                    style={{marginLeft:11}}
                    color={tintColor}
                    onPress={_handelCompleteButtonPress} //글 등록 버튼 함수(이벤트 추가 필요)
                />
            ),
        });
    }, []);



    return(
        <KeyboardAwareScrollView 
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <List width={width}>
                <TitleInput 
                    ref={refTitle}
                    placeholder="제목"
                    value={newTitle}
                    onChangeText={_handleTitleChange}
                    onSubmitEditing={()=>refContent.current.focus()}
                />
                <ContentInput 
                    ref={refContent}
                    placeholder="내용"
                    value={newContent}
                    onChangeText={_handleContentChange}
                />
            </List>
        </Container>
        </KeyboardAwareScrollView>
    );
};

export default BoardWrite;