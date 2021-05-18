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
    width: ${({width})=>width-40}px;
`;


const MyClubBoard=({ navigation, route })=>{
    const { spinner } = useContext(ProgressContext);

    const width= Dimensions.get('window').width;

    const refTitle=useRef();
    const refContent=useRef();
    const clubId = route.params.clubId;
    const boardId = route.params.boardId;
    const [title, setTitle]=useState('');
    const [content, setContent]=useState('');

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
                    onPress={_handelCompleteButtonPress} //글 등록 버튼 함수(이벤트 추가 필요)
                />
            ),
        });
    }, [title, content]);

    useEffect(() => {
      getBoard();
    }, []);


    const myClubBoardWrite = async() => {

      const user = getCurrentUser();
      const boardRef = DB.collection('clubs').doc(id).collection('board').doc(boardId);
      const boardData =

      await boardRef.set(newBoard);

      return true;

    }

    const _handelCompleteButtonPress= async() => { //상단바 글 등록 버튼에 사용되는 함수 -> 이벤트 처리 필요
      if (title == '' || content == '') {
        Alert.alert('글 수정 오류', `제목 또는 글 내용이 없습니다.`);
      }
      else{
        try {
          spinner.start();
          const boardRef = DB.collection('clubs').doc(clubId).collection('board').doc(boardId);
          const update = async() => {
            boardRef.update({title: title, content: content});
          }

          update();

          navigation.navigate('MyClubTab', {screen: 'MyClubBoardList'});
          Alert.alert('수정이 완료되었습니다.');
        }
        catch(e) {
          Alert.alert('글 수정 오류', e.message);
        }
        finally {
          spinner.stop();
        }
      }
    };

    const getBoard = async() => {
      try{
        spinner.start();
        const boardRef = await DB.collection('clubs').doc(clubId).collection('board').doc(boardId).get();
        const data = boardRef.data();

        setTitle(data.title);
        setContent(data.content);

      }
      catch(e) {
        Alert.alert('게시판 데이터 수신 오류', e.message);
      }
      finally {
        spinner.stop();
      }
    }

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
