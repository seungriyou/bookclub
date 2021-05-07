import React, {useLayoutEffect, useState} from 'react';
import {Dimensions, FlatList} from 'react-native';
import styled from 'styled-components/native';
import ReplyInput from '../components/ReplyInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {BoardTitle, BoardContent, BoardInfo} from '../components/BoardInfo';
import BoardCommentList from '../components/BoardCommentList';

const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.appBackground};
    align-items: center;
    padding-bottom: 100px;
    justify-content: flex-start;
`;

const Containerforreply=styled.View`
    flex: 1;
    position: absolute;
    bottom: 0;     
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width-40}px;
`;

const Listforreply=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;


const Line=styled.View`
    height:2px;
    background-color: ${({theme})=>theme.line};
`;

const tempData = {
    "title": "05월 정기모임",
    "writer_name": "관리자",
    "upload_date": "2021/05/05",
    "comment_cnt": 6,
    "comment": [
      {
        "id": 1,
        "writer_name": "멤버A",
        "content": "재미있었어요!",
        "upload_date": "2021/05/05",
      },
      {
        "id": 2,
        "writer_name": "멤버B",
        "content": "사진 공유 감사합니다 :)",
        "upload_date": "2021/05/05",
      },
      {
        "id": 3,
        "writer_name": "멤버C",
        "content": "확인했습니다~",
        "upload_date": "2021/05/05",
      },
      {
        "id": 4,
        "writer_name": "멤버D",
        "content": "감사합니당!",
        "upload_date": "2021/05/05",
      },
      {
        "id": 5,
        "writer_name": "멤버E",
        "content": "확인했어요! 좋은 주말 되세요~",
        "upload_date": "2021/05/05",
      },
      {
        "id": 6,
        "writer_name": "멤버F",
        "content": "다음 모임에서 뵙겠습니다!",
        "upload_date": "2021/05/06",
      }
    ]
}



const MyClubBoardView=({ navigation })=>{

    const width= Dimensions.get('window').width;

    const [NewReply, setNewReply] = useState('');

    const _handleReplyChange = text => {
        setNewReply(text);
    }

    const _addReply = ()=>{
        if(!NewReply){
            alert("댓글을 입력해주세요");
        }
        else {alert("댓글을 입력하였습니다.");
        setNewReply('');}
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
                        style={{marginLeft:13}}
                        color={tintColor}
                        onPress={onPress}
                    />
                );
            },
            headerRight: ({tintColor})=>(
                <MaterialCommunityIcons
                    name="pencil"
                    size={30}
                    style={{marginRight:13}}
                    color={tintColor}
                    onPress={()=>navigation.navigate('test')} //글 등록 버튼 함수(이벤트 추가 필요)
                />
            ),
        });
      console.log(navigation);
    }, []);



    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
        
            <List width={width}>
                <BoardTitle 
                    title="[공지]4/12 오프라인 모임 안내" 
                /> 
                <Line />
                <BoardInfo 
                    writer="작성자: 김뫄뫄" 
                    writedate="04/06" 
                    reply="댓 4"
                />
                <Line />
                <BoardContent 
                    content="공지의 내용입니다." 
                />    
                <BoardCommentList postInfo={tempData}></BoardCommentList>
            </List>
        

        <Containerforreply>
            <Listforreply width={width}>
                <ReplyInput 
                    placeholder="댓글을 입력하세요"
                    value={NewReply}
                    onChangeText={_handleReplyChange}
                    onSubmitEditing={()=>{}}
                    onPress={_addReply}
                />
            </Listforreply>
        </Containerforreply>
        </Container>
        </KeyboardAwareScrollView>
    );
};

export default MyClubBoardView;
