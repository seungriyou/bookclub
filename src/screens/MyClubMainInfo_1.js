//클럽 모임장이 진행중인 책을 수정하는 화면 -> 클럽 모임장만 진입 가능
//조작 부분 외 다른 부분의 클릭을 막는 방법 필요

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Image, Button, TextInput, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import UserProcessList from '../components/UserProcessList';
import { DB, getCurrentUser } from '../utils/firebase';
import { ProgressContext } from '../contexts';
import moment from 'moment';

const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const Layout=styled.View`
    background-color: ${({theme})=>theme.background};
    align-items: center;
    flex-direction: row;
`;

const Header=styled.View`
    width: ${({width})=>width}px;
    height: 80px;
    background-color: ${({theme})=>theme.background};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    padding: 0;
`;


const Process=styled.View`
    min-height: 120px;
    flex-direction: row;
`;

const ProcessBook=styled.View`
    flex: 30%;
    background-color: ${({theme})=>theme.appBackground};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0 10px 0;
    borderRight-color: ${({theme})=>theme.background};
    borderRight-width: 3px;
`;

const ProcessText=styled.View`
    flex: 70%;
    background-color: ${({theme})=>theme.appBackground};
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 10px 0px 10px 0;
`;

const ProcessCon=styled.View`
    background-color: ${({theme})=>theme.background};
    width: ${({width})=>(width)*0.65}px;
    margin: 5px 0 5px 10px;
    border-radius: 5px;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const styles = StyleSheet.create({
    clubname: {
      fontSize: 25,
      color: theme.text,
    },
    processText: {
      fontSize: 14,
      color: theme.text,
      padding: 0,
      marginLeft: 10,
      marginVertical: 7,
      backgroundColor: theme.background,
    },
    bookimg: {
        width: 90,
        height: 120,
    },
    input: {
        height: 40,
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: theme.appBackground,
        borderRadius: 10,
      },
  });


const MainHeader= ({clubname, onPress1, onPress2})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
        <Button
            title="책 완료하기"
            onPress={onPress1}      //수정필요-진행완료한 책 목록 화면으로 이동
            color= '#fac8af'
        />
        <Text style={styles.clubname}>{clubname}</Text>
        <Button
            title="수정 완료"
            onPress={onPress2}      //다시 maininfo로 복귀
            color= '#fac8af'
        />
        </Header>
    )
};

const MainProcess=({booktitle, _handlebookChange, goal, _handlegoalChange, page, cover})=>{
    const width = Dimensions.get('window').width;
    return(
        <Process>
        <ProcessBook>
            <Image
                style={styles.bookimg}
                source={{
                uri: cover,
                }}
            />
        </ProcessBook>
        <ProcessText>
            <ProcessCon width={width}>
            <Text style={styles.processText}>제목: {booktitle}</Text>
            </ProcessCon>
            <ProcessCon width={width}>
            <TextInput
                style={styles.input}
                placeholder="목표치를 입력하세요"
                onChangeText={_handlegoalChange}
                value={goal}
            />
            </ProcessCon>
            <ProcessCon width={width}>
            <Text style={styles.processText}>현재 목표치: {page}P</Text>
            </ProcessCon>
        </ProcessText>
    </Process>
    )
}

const MyClubMainInfo_1=({ navigation, route })=>{
    const id = route.params?.id;
    const width= Dimensions.get('window').width;

    const user = getCurrentUser();

    const [goal, setgoal] = useState('');
    const [userPage, setUserPage] = useState('');
    const [mainData, setMainData] = useState({
      clubname: "",
      booktitle: "",
      bookcover: "",
      goal: 0,
      userlist: []
    });

    const _handlegoalChange = text => {
          setgoal(text);
    }

    const _alertfinish= async() => {
      const regex = /^[0-9]/;
      if (regex.test(goal)) {
        try{
          const clubRef = DB.collection('clubs').doc(id);
          await DB.runTransaction(async (t) => {
            const doc = await t.get(clubRef);
            const data = doc.data();

            const bookNow = data.book_now;
            bookNow.goal = parseInt(goal);

            t.update(clubRef, {book_now: bookNow});
          });
          setgoal();
          alert('수정을 완료했습니다.');
          navigation.navigate('MyClubTab', {screen: 'MyClubMainInfo', params: {id: id}});   //값 변경 이후에는 원래의 Info화면으로 돌아올 것
        }
        catch(e) {
          Alert.alert("목표 페이지 수정 에러", e.message);
        }
      }
      else{
        alert('페이지는 정수로 입력해주세요');
      }
    }

    const _alertadd= async() =>{
      Alert.alert("알림", "책을 완료하고 완료 목록으로 보내시겠습니까?",
      [
        {
          text: "아니요",
          style: "cancel"
        },
        {
          text: "예",
          onPress: async () => {
            try{
              const clubRef = DB.collection('clubs').doc(id);
              await DB.runTransaction(async (t) => {
                const doc = await t.get(clubRef);
                const data = doc.data();

                let bookNow = data.book_now;
                let bookCompleted = data.book_completed;
                let members = data.members;

                const tempDate = moment(Date.now()).format('YYYY/MM/DD');
                bookNow.completeyear = tempDate.slice(0, 4);
                bookNow.completemonth = tempDate.slice(5, 7);
                bookNow.completedate = tempDate.slice(8);

                const completemember = [];

                for (let member of members) {
                  if (member.now_page >= bookNow.goal) {
                    completemember.push(member);
                  }
                }

                bookNow.members = completemember;
                bookCompleted.push(bookNow);

                let newMembers = [];

                for(let i = 0; i < members.length; i++) {
                  newMembers.push({
                    name: members[i].name,
                    now_page: 0,
                    photoUrl: members[i].photoUrl,
                    uid: members[i].uid,
                    email: members[i].email
                  });
                }

                bookNow = {
                  title: "",
                  goal: 0,
                  cover: "",
                  createAt: 0,
                  description: "",
                };

                t.update(clubRef, {book_now: bookNow, book_completed: bookCompleted, members: newMembers});
              });
              alert('등록을 완료했습니다.');
              navigation.navigate('MyClubTab', {screen: 'MyClubMainInfo', params: {id: id}});
            }
            catch(e) {
              Alert.alert('책 완료 등록 에러', e.message);
            }
          }
        }
      ]);
    }

    const getMainData= async() => {
      try{
        const clubRef = DB.collection('clubs').doc(id);
        const clubDoc = await clubRef.get();
        const clubData = clubDoc.data();
        const tempData = {
          clubname: "",
          booktitle: "",
          bookcover: "",
          goal: 0,
          userlist: []
        }

        tempData.clubname = clubData.title;
        tempData.booktitle = clubData.book_now.title;
        tempData.goal = clubData.book_now.goal;
        tempData.bookcover = clubData.book_now.cover;
        const tempuserlist = [];
        let index = 0;
        for (let member of clubData.members) {
          let user_rate = 0;
          if (tempData.goal !== 0) {
            user_rate = member.now_page / tempData.goal;
            user_rate = user_rate.toFixed(1);
          }
          if (member.uid === user.uid) {
            setUserPage(member.now_page);
          }
          if (user_rate > 1.0) {
            user_rate = 1.0;
          }
          index = index + 1;
          const tempuser = {
            id: index,
            user_name: member.name,
            img_url: member.photoUrl,
            user_rate: user_rate,
          }

          tempData.userlist.push(tempuser);
        }

        setMainData(tempData);
      }
      catch(e) {
        Alert.alert('메인 페이지 데이터 수신 에러', e.message);
      }
    };

    useLayoutEffect(()=>{
      getMainData();
    }, []);


    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader
                clubname={mainData.clubname}
                onPress1={_alertadd}
                onPress2={_alertfinish}
            ></MainHeader>

            <MainProcess
                booktitle={mainData.booktitle}
                goal={goal}
                _handlegoalChange={_handlegoalChange}
                goalpage={mainData.goal}
                cover={mainData.bookcover}
                page={mainData.goal}
            ></MainProcess>

            <List width={width}>
            <UserProcessList userInfo={mainData}></UserProcessList>
            </List>

        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubMainInfo_1;
