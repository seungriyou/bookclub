import React, {useLayoutEffect, useEffect, useState, useRef, useContext} from 'react';
import {Dimensions, Alert} from 'react-native';
import styled from 'styled-components/native';
import TitleInput from '../components/TitleInput';
import ContentInput from '../components/ContentInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ProgressContext } from '../contexts';
import { DB, getCurrentUser } from '../utils/firebase';

const Container=styled.View`
    flex: 1;
    background-color: ${({theme})=>theme.buttonBackground};
    align-items: center;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width-40}px;
`;


const MyClubBoard=({ navigation, route })=>{
    const { spinner } = useContext(ProgressContext);

    const width= Dimensions.get('window').width;

    const refTitle=useRef();
    const refContent=useRef();

    const [title, setTitle]=useState('');
    const [content, setContent]=useState('');
    const [id, setId] = useState('');

    const _handleTitleChange = text => {
        setTitle(text);
    }
    const _handleContentChange = text => {
        setContent(text);
    }

    const myClubBoardWrite = async() => {
      const user = getCurrentUser();
      const boardRef = DB.collection('clubs').doc(id).collection('board').doc();

      const newBoard = {
        title,
        author: user,
        content,
        createAt: Date.now(),
        comments: [],
        comment_cnt: 0,
      }

      await boardRef.set(newBoard);

      console.log("upload complete");

      return true;

    }

    const _handelCompleteButtonPress= async() => { //상단바 글 등록 버튼에 사용되는 함수 -> 이벤트 처리 필요
        try {
          spinner.start();
          await myClubBoardWrite();
          navigation.navigate('MyClubTab', {screen: 'MyClubBoardList'});
        }
        catch(e) {
          Alert.alert('글 업로드 오류', e.message);
        }
        finally {
          spinner.stop();
        }
    };

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
      setId(route.params?.id);
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
                    value={title}
                    onChangeText={_handleTitleChange}
                    onSubmitEditing={()=>refContent.current.focus()}
                />
                <ContentInput
                    ref={refContent}
                    placeholder="내용"
                    value={content}
                    onChangeText={_handleContentChange}
                />
            </List>
        </Container>
        </KeyboardAwareScrollView>
    );
};

export default MyClubBoard;
