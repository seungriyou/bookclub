import React, {useLayoutEffect, useState, useContext, useEffect} from 'react';
import {Dimensions, FlatList, Alert} from 'react-native';
import styled from 'styled-components/native';
import ReplyInput from '../components/ReplyInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {BoardTitle, BoardContent, BoardInfo} from '../components/BoardInfo';
import BoardCommentList from '../components/BoardCommentList';
import { ProgressContext } from '../contexts';
import { DB, getCurrentUser} from '../utils/firebase';
import moment from 'moment';

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

const Layout=styled.View`
    background-color: ${({theme})=>theme.background};
    align-items: center;
    flex-direction: row;
`;

const MyClubBoardView=({ navigation, route })=>{
    const { spinner } = useContext(ProgressContext);
    const boardId = route.params.id;
    const clubId = route.params.clubId;
    const author = route.params.author;
    const user = getCurrentUser();

    const width= Dimensions.get('window').width;

    const [update, setUpdate] = useState(0); //새로고침을 위한 변수
    const [comment, setComment] = useState('');
    const [commentCntTxt, setCommentCntTxt] = useState('');
    const [boardData, setBoardData] = useState({
      title: '',
      writer_name: '',
      upload_date: '',
      content: '',
      comment: [],
      comment_cnt: 0,
    });
    const [isAuthor, setIsAuthor] = useState(false);

    const _handleReplyChange = text => {
        setComment(text);
    }

    const getDate = ts => {
      const now = moment().startOf('day');
      const target = moment(ts).startOf('day');
      return moment(ts).format('MM/DD');
    };

    const _handelEditButtonPress = () => {
      navigation.navigate('MyClubBoardNav', {screen: 'MyClubBoardEdit', params: {clubId: clubId, boardId: boardId}});
    };

    const _handelDeleteButtonPress = () => {
      Alert.alert("경고", "글을 삭제하시겠습니까?",
      [
        {
          text: "아니요",
          style: "cancel"
        },
        {
          text: "예",
          onPress: async () => {
            try {
              const boardRef = await DB.collection('clubs').doc(clubId).collection('board').doc(boardId).delete();
              navigation.navigate("MyClubTab", {screen: "MyClubBoardList", params: {id: clubId}});
              Alert.alert("글 삭제 완료");
            }
            catch(e) {
              Alert.alert("글 삭제 오류", e.message);
            }
          }
        }
      ]);
    };

    const getBoard = async() => {
      try{
        spinner.start();
        const boardRef = await DB.collection('clubs').doc(clubId).collection('board').doc(boardId).get();
        const data = boardRef.data();

        if (data.author.uid === user.uid) {
          setIsAuthor(true);
        }

        const tempData = {
          title: data.title,
          writer_name: data.author.name,
          upload_date: data.createAt,
          content: data.content,
          comment: data.comment,
          comment_cnt: data.comment_cnt,
        }
        console.log(tempData);
        setBoardData(tempData)
        setCommentCntTxt(`댓 ${data.comment_cnt}`);
      }
      catch(e) {
        Alert.alert('게시판 데이터 수신 오류', e.message);
      }
      finally {
        spinner.stop();
      }
    }

    const _addReply = async () => {
      if (!comment) {
        Alert.alert("댓글을 입력해주세요.");
      }
      else {
        Alert.alert(`댓글을 입력하였습니다.`, `댓글 내용:${comment}`);
        console.log(`Comment: ${comment}`);
        try{
          const boardRef = DB.collection('clubs').doc(clubId).collection('board').doc(boardId);
          await DB.runTransaction(async (t) => {
            const doc = await t.get(boardRef);
            const data = doc.data();

            console.log(data);

            const oldComment = data.comment;
            const oldCommentCnt = data.comment_cnt;

            console.log("oldComment : ",oldComment, "cnt : ",oldCommentCnt);

            let newCommentIdx = 0;

            if (oldCommentCnt == 0) {
              newCommentIdx = 0;
            }
            else {
              newCommentIdx = oldComment[oldCommentCnt - 1].id + 1;
            }

            const tempComment = {
              id: newCommentIdx,
              writer: user,
              content: comment,
              upload_date: Date.now(),
            }

            console.log("tempComment : ", tempComment);

            const newCommentCnt = oldCommentCnt + 1;

            oldComment.push(tempComment)

            const newComment = oldComment;

            console.log("newComment : ", newComment);

            t.update(boardRef, {comment: newComment, comment_cnt: newCommentCnt});
            setCommentCntTxt(`댓 ${newCommentCnt}`);
          });
          setComment('');

        }
        catch (e) {
          Alert.alert('댓글 작성 오류', e.message);
        }
        finally{
          spinner.stop();
          setUpdate(update => update + 1);
        }
      }
    };

    useLayoutEffect(()=>{
      getBoard();
    }, []);

    // useEffect(() => {
    //
    // }, []);

    useEffect(() => {
      getBoard();
    }, [update]);

    useEffect(() => {
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
          headerRight: ({onPress, tintColor})=>(
            isAuthor && (
              <Layout>
                <MaterialCommunityIcons
                    name="pencil"
                    size={30}
                    style={{marginRight:13}}
                    color={tintColor}
                    onPress={_handelEditButtonPress}
                />
                <MaterialCommunityIcons
                    name="trash-can"
                    size={30}
                    style={{marginRight:13}}
                    color={tintColor}
                    onPress={_handelDeleteButtonPress}
                />
              </Layout>
            )
          ),
      });
    }, [boardData])

    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <List width={width}>
                <BoardTitle
                    title={boardData.title}
                />
                <Line />
                <BoardInfo
                    writer={boardData.writer_name}
                    writedate={getDate(boardData.upload_date)}
                    reply={commentCntTxt}
                />
                <Line />
                <BoardContent
                    content={boardData.content}
                />
                <BoardCommentList postInfo={boardData}></BoardCommentList>
            </List>


        <Containerforreply>
            <Listforreply width={width}>
                <ReplyInput
                    placeholder="댓글을 입력하세요"
                    value={comment}
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
