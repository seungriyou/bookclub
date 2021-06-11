//모임장만 진입 가능한 클럽의 회원 목록을 조회하는 화면


import React, {useLayoutEffect, useState, useEffect } from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import UserAdminList from '../components/UserAdminList';
import { DB, getCurrentUser } from '../utils/firebase';



const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const Header=styled.View`
    width: ${({width})=>width}px;
    height: 120px;
    background-color: ${({theme})=>theme.background};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    borderBottom-color: ${({theme})=>theme.appBackground};
    borderBottom-width: 3px;
    padding: 0;
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
      fontSize: 16,
      color: theme.text,
      padding: 3,
      marginLeft: 10,
      marginVertical: 7,
      backgroundColor: theme.background,
    },
    bookimg: {
        width: 70,
        height: 100,
    },
  });


const MainHeader= ({clubname})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
        <Text style={styles.clubname}>{clubname}</Text>
        </Header>
    )
};


const MyClubUserAdmin=({ navigation, route })=>{
    const clubId = route.params.id;
    const width= Dimensions.get('window').width;

    const user = getCurrentUser();

    const [clubData, setClubData] = useState({
      clubname: "",
      leader: {
        name: ""
      },
      maxNumber: 0,
      region: "",
      title: ""
    });

    const [memberData, setMemberData] = useState({
      userlist: [],
    });

    const [update, setUpdate] = useState(0)

    const getClubInfo = async() => {
      try {
        const clubRef = DB.collection('clubs').doc(clubId);
        const clubDoc = await clubRef.get();
        const clubData = clubDoc.data()
        setClubData(clubData);

        let list = []
        for (let member of clubData.members) { //list에 들어갈 userData를 추출
          if(member.uid !== user.uid) {
            const temp = {
              id: member.uid,
              user_name: member.name,
              img_url: member.photoUrl,
              user_mail: member.email,
            }
            list.push(temp);
          }
        }

        setMemberData({userlist: list});
      }
      catch(e) {
        Alert.alert('클럽 데이터 수신 오류', e.message);
      }
    }

    const onUpdate = () => {
      setUpdate(update + 1);
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
        });
        getClubInfo();
    }, []);

    useEffect(() => {
        getClubInfo();
    }, [update]);


    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader clubname={clubData.title}></MainHeader>

            <List width={width}>
              <UserAdminList userInfo={memberData} clubId={clubId} onchange={onUpdate} currentUser={user}></UserAdminList>
            </List>

        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubUserAdmin;
