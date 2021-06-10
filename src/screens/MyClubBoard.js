//게시판 글 작성 화면
//제목, 내용을 입력하여 글을 등록합니다.

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
    background-color: ${({theme})=>theme.appBackground};
    align-items: center;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
    paddingLeft: 20px;
`;


const MyClubBoard=({ navigation, route })=>{
    const { spinner } = useContext(ProgressContext);

    const width= Dimensions.get('window').width;

    const refTitle=useRef();
    const refContent=useRef();

    const [title, setTitle]=useState('');
    const [content, setContent]=useState('');
    const [id, setId] = useState('');
    const [update, setUpdate] = useState(0);

    const _handleTitleChange = text => {
      setTitle(text);
    }
    const _handleContentChange = text => {
      setContent(text);
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
                    style={{marginRight:11}}
                    color={tintColor}
                    onPress={_handelCompleteButtonPress} 
                />
            ),
        });
    }, [title, content]);

    useEffect(() => {
      setId(route.params?.id);
    }, []);

    const myClubBoardWrite = async() => {

      const user = getCurrentUser();
      const boardRef = DB.collection('clubs').doc(id).collection('board').doc();
      const boardId = boardRef.id;

      const newBoard = {
        id: boardId,
        title,
        author: user,
        content,
        createAt: Date.now(),
        comment: [],
        comment_cnt: 0,
      };

      await boardRef.set(newBoard);

      return true;

    }

    const _handelCompleteButtonPress= async() => { 
      if (title == '' || content == '') {
        alert(`제목 또는 글 내용이 없습니다.`);
      }
      else{
        try {
          spinner.start();
          await myClubBoardWrite();
          navigation.navigate('MyClubTab', {screen: 'MyClubBoardList'});
          Alert.alert('글 등록이 완료되었습니다.');
        }
        catch(e) {
          Alert.alert('글 업로드 오류', e.message);
        }
        finally {
          spinner.stop();
        }
      }

    };

    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <List width={width}>
                <TitleInput
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
