//클럽 내 각자의 진행상황을 표시하는 메인 화면

import React, {useLayoutEffect, useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, Dimensions, Text, Image, Button, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import UserProcessList from '../components/UserProcessList';
import { DB, getCurrentUser } from '../utils/firebase';
import { ProgressContext } from '../contexts';
import RCButton from '../components/RCButton';



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
    justify-content: center;
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
  });

const MainHeader= ({clubname, movetoInfo1, movetoInfo2})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
          <RCButton
           title="목표 수정"
           onPress={movetoInfo1}
          
          />
          <Text style={styles.clubname}>{clubname}</Text>
          <RCButton
            title="진행 수정"
            onPress={movetoInfo2}
           
          />
        </Header>
    )
};

const MainProcess=({booktitle, goalpage, cover, page})=>{
    const width = Dimensions.get('window').width;

    return(
        <Process>
        <ProcessBook>
            <Image
                style={styles.bookimg}
                source={{uri: cover}}
            />
        </ProcessBook>
        <ProcessText>
            <ProcessCon width={width}>
            <Text style={styles.processText}>제목: {booktitle}</Text>
            </ProcessCon>
            <ProcessCon width={width}>
            <Text style={styles.processText}>목표 페이지: {goalpage}P</Text>
            </ProcessCon>
            <ProcessCon width={width}>
            <Text style={styles.processText}>진행중인 페이지: {page}P</Text>
            </ProcessCon>
        </ProcessText>
    </Process>
    )
}

const MyClubMainInfo=({ navigation, route })=>{
    const { spinner } = useContext(ProgressContext);
    const id = route.params?.id;
    const user = getCurrentUser();

    const width = Dimensions.get('window').width;

    const [mainData, setMainData] = useState({
      clubname: "",
      booktitle: "",
      bookcover: "",
      goal: 0,
      userlist: []
    });

    const [leader, setLeader] = useState({
      uid: 0
    });
    const [userPage, setUserPage] = useState(0);
    const [isThereBook, setIsThereBook] = useState(false);

    const movetoInfo2=()=>{
        navigation.navigate('MyClubMainInfoNav', {screen: 'MyClubMainInfo_2', params: {id: id, user: user}});
    }

    const movetoInfo1=()=>{
        if (leader.uid == user.uid) {
            navigation.navigate('MyClubMainInfoNav', {screen: 'MyClubMainInfo_1', params: {id: id, user: user}});
        }
        else {
          Alert.alert('권한 오류', '클럽 리더만이 목표를 설정할 수 있습니다.');
        }
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
        if (clubData.book_now.title === "" && clubData.book_now.cover === "") {
          setIsThereBook(false);

          tempData.clubname = clubData.title;
          setMainData(tempData);
          setLeader(clubData.leader);
        }
        else {
          setIsThereBook(true);

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
          setLeader(clubData.leader);
        }

      }
      catch(e) {
        Alert.alert('메인 페이지 데이터 수신 에러', e.message);
      }
    };

    useEffect(() => {
      getMainData();
    }, []);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getMainData();
      });
      return unsubscribe;
    }, [navigation]);

    // useLayoutEffect(()=>{
    //     navigation.setOptions({
    //         headerBackTitleVisible: false,
    //         headerTintColor: '#000000',
    //         headerLeft: ({onPress, tintColor})=>{
    //             return(
    //                 <Layout>
    //                 <MaterialCommunityIcons
    //                     name="keyboard-backspace"
    //                     size={30}
    //                     style={{marginLeft:13}}
    //                     color={tintColor}
    //                     onPress={onPress}   //뒤로가기
    //                 />
    //                 <MaterialCommunityIcons
    //                     name="alert-circle"
    //                     size={30}
    //                     style={{marginLeft:10}}
    //                     color={tintColor}
    //                     onPress={()=>navigation.navigate("MyClubMainManage")}   //클럽 정보를 관리하는 MyClubMainManage로 이동
    //                 />
    //                 </Layout>
    //             );
    //         },
    //         headerRight: ({onPress, tintColor})=>{
    //             return(
    //                 <Layout>
    //                 <MaterialCommunityIcons
    //                     name="format-list-bulleted"
    //                     size={30}
    //                     style={{marginRight:10}}
    //                     color={tintColor}
    //                     onPress={onPress}   //수정필요-진행완료된 책 화면으로 이동
    //
    //                 />
    //                 <MaterialCommunityIcons
    //                     name="magnify"
    //                     size={30}
    //                     style={{marginRight:10}}
    //                     color={tintColor}
    //                     onPress={onPress}   //수정필요-책 추천화면 이동
    //                 />
    //                 </Layout>
    //             );
    //         },
    //     });
    // }, []);

    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
          <Container>
              <MainHeader clubname={mainData.clubname} movetoInfo1={movetoInfo1} movetoInfo2={movetoInfo2} />

          {isThereBook ? (
            <Container>
                <MainProcess
                    booktitle={mainData.booktitle}
                    goalpage={mainData.goal}
                    page={userPage}
                    cover={mainData.bookcover}
                />

                <List width={width}>
                  <UserProcessList userInfo={mainData}></UserProcessList>
                </List>
            </Container>
          ) : (
              <Button
                title="목표 도서 등록하기"
                onPress={()=>{navigation.navigate('MyClubMainInfoNav', {screen:'MyClubBookSearch', params: {id: id}})}}
                color= '#fac8af'
              />
          )}
          </Container>
        </KeyboardAwareScrollView>
    );
};



export default MyClubMainInfo;
