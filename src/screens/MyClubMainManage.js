//클럽을 총괄 관리하는 화면
//모임 탈퇴 함수가 필요합니다.

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Button, Image, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import { DB, getCurrentUser, Storage } from '../utils/firebase';
import RCButton from '../components/RCButton';


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


const MainHeader= ({clubname})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>

        <Text style={styles.clubname}>{clubname}</Text>

        </Header>
    )
};


const AllCon=styled.View`
  background-color: ${({ theme }) => theme.background};
  borderBottom-Width: 2.5px;
  borderBottom-Color: ${({ theme }) => theme.appBackground};
  width: ${({ width }) => (width)}px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  paddingRight: 10px;
  paddingBottom: 7px;
  marginBottom: 30px;
`;

const ContainerRow=styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.background};
`;

const Fix1=styled.View`
  width: ${({ width }) => (width)*0.22}px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  borderRight-Width: 1px;
  borderRight-Color: ${({ theme }) => theme.separator};

`;

const Fix2=styled.View`
  width: ${({ width }) => (width)*0.78}px;
`;

const ButtonFix1=styled.View`
  marginTop: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonFix2=styled.View`
  width: ${({ width }) => (width)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  marginTop: 60px;
  marginBottom: 50px;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const Line=styled.View`
  background-color: ${({ theme }) => theme.appBackground};
  height: 0.8px;
  width: ${({ width }) => (width)}px;
`;

const styles = StyleSheet.create({
  First: {
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  Second:{
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  Img: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  clubname: {
    fontSize: 25,
    color: theme.text,
  },
});

const MyClubMainManage=({ navigation, route })=>{
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

    const getClubInfo = async() => {
      try {
        const clubRef = DB.collection('clubs').doc(clubId);
        const clubDoc = await clubRef.get();
        const clubData = clubDoc.data()
        setClubData(clubData);
      }
      catch(e) {
        Alert.alert('클럽 데이터 수신 에러', e.message);
      }
    }

    const clubMemberOut = async() => {
      try {
        const clubRef = DB.collection('clubs').doc(clubId);
        await DB.runTransaction(async (t) => {
          const doc = await t.get(clubRef);
          const data = doc.data();

          let members = data.members;
          let newMember = members.filter((member) => member.uid !== user.uid);

          t.update(clubRef, {members: newMember});
        });

        const userRef = DB.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        let newClubList = userData.club;
        delete newClubList.clubId;

        userRef.update({club: newClubList});

        navigation.navigate("Clubs");

        Alert.alert("안내", "클럽 탈퇴 완료");
      }
      catch(e) {
        Alert.alert("클럽 탈퇴 오류", e.message);
      }
    }

    const clubLeaderOut = async() => {
      const clubRef = DB.collection('clubs').doc(clubId);
      const clubDoc = await clubRef.get();
      const clubData = clubDoc.data();

      if (clubData.members.length === 1) {
        clubDelete();
      }

      else {
        try {
          const clubRef = DB.collection('clubs').doc(clubId);
          await DB.runTransaction(async (t) => {
            const doc = await t.get(clubRef);
            const data = doc.data();

            let members = data.members;
            let newMember = members.filter((member) => member.uid !== user.uid);
            let newLeader = newMember[0];

            delete newLeader.now_page;

            t.update(clubRef, {members: newMember, leader: newLeader});
          });

          const userRef = DB.collection('users').doc(user.uid);
          await DB.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);
            const userData = userDoc.data();

            const club = {};

            for (let key in userData.club) {
              if(key !== clubId) {
                  club[key] = userData.club[key]
              }
            }

            t.update(userRef, {club: club});
          });


          navigation.navigate("Clubs");

          Alert.alert("안내", "클럽 탈퇴 완료");
        }
        catch(e) {
          Alert.alert("클럽 탈퇴 오류", e.message);
        }
      }
    }

    const clubDelete = async() => {
      try{
        const storageRef = Storage.ref();
        const storageAlbumRef = storageRef.child(`clubs/${clubId}/albums`);
        storageAlbumRef.listAll().then(albumId => {
          albumId.prefixes.forEach(res => {
            res.listAll().then(res => {
              res.items.forEach(itemRef => {
                itemRef.delete().then(()=>{})
                .catch(e => {console.log(e.message)});
              });
            });
          });
        });
        const clubRef = DB.collection('clubs').doc(clubId);
        const clubDoc = await clubRef.get();
        const clubData = clubDoc.data();

        clubData.members.forEach( async(member) => {
          const userRef = DB.collection('users').doc(member.uid);
          await DB.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);
            const userData = userDoc.data();

            const club = {};

            for (let key in userData.club) {
              if(key !== clubId) {
                  club[key] = userData.club[key]
              }
            }

            t.update(userRef, {club: club});
          });

        });

        const collectionList = ['essay', 'board', 'schedule', 'album'];

        collectionList.forEach(async collection => {
          const ref = DB.collection('clubs').doc(clubId).collection(collection);
          const snapshot = await ref.get();
          snapshot.forEach(async (doc) => {
            const docRef = DB.collection('clubs').doc(clubId).collection(collection).doc(doc.id);
            await docRef.delete();
          });
        });

        await clubRef.delete();

        Alert.alert("클럽 삭제 완료");

        navigation.navigate("Clubs");
      }
      catch(e) {
        Alert.alert("클럽 삭제 오류", e.message);
      }
    }

    const _handleUserAdminButtonPress = () => {
      if (user.uid === clubData.leader.uid) {
          navigation.navigate("MyClubMainInfoNav", {screen:"MyClubUserAdmin", params: {id: clubId}});
      }
      else {
        Alert.alert("권한 오류", "멤버의 강퇴는 클럽 리더만 가능합니다.");
      }

    }

    const _handleWaitAdminButtonPress = () => {
      if (user.uid === clubData.leader.uid) {
          navigation.navigate("MyClubMainInfoNav", {screen: "MyClubWaitAdmin", params: {id: clubId}});
      }
      else {
        Alert.alert("권한 오류", "가입 승인은 클럽 리더만 가능합니다.");
      }
    }

    const _handleMainManageButtonPress = () => {
      if (user.uid === clubData.leader.uid) {
          navigation.navigate("MyClubMainInfoNav", {screen: "MyClubMainM", params: {id: clubId}});
      }
      else {
        Alert.alert("권한 오류", "클럽 정보 수정은 클럽 리더만 가능합니다.");
      }
    }

    const _handleClubOutButtonPress = () => {
      Alert.alert("경고", "클럽을 탈퇴하시겠습니까?",
      [
        {
          text: "아니요",
          style: "cancel"
        },
        {
          text: "예",
          onPress: () => {
            if (user.uid === clubData.leader.uid) {
              Alert.alert("경고", `당신은 클럽장입니다. 탈퇴 시 다른 회원에게 클럽장 권한이 넘어가게 되며, 다른 클럽원이 없을 경우 클럽은 삭제됩니다. 클럽을 탈퇴하시겠습니까?`,
              [
                {
                  text: "아니요",
                  style: "cancel"
                },
                {
                  text: "예",
                  onPress:() => {clubLeaderOut()}
                }
              ]);
            }
            else {
              clubMemberOut();
            }
          }
        }
      ]);
    }

    const _handleClubDeleteButtonPress = () => {
      if (user.uid === clubData.leader.uid) {
        Alert.alert("경고", "클럽을 삭제하시겠습니까?",
        [
          {
            text: "아니요",
            style: "cancel"
          },
          {
            text: "예",
            onPress: () => {
              Alert.alert("경고", `클럽에 존재하는 모든 글과 독서상황, 사진이 삭제됩니다. 클럽을 삭제하시겠습니까?`,
              [
                {
                  text: "아니요",
                  style: "cancel"
                },
                {
                  text: "예",
                  onPress:() => {clubDelete()}
                }
              ]);
            }
          }
        ]);
      }
      else {
        Alert.alert("권한 오류", "클럽 삭제는 클럽 리더만 가능합니다.");
      }
    }

    useLayoutEffect(()=>{
        getClubInfo();
    }, []);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getClubInfo();
      });
      return unsubscribe;
    }, [navigation]);

    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader clubname={clubData.title}></MainHeader>

        <List width={width}>
            <AllCon width={width}>
              <Text style={styles.Second}>{clubData.description}</Text>
              <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>관리자</Text>
                    </Fix1>
                    <Fix2 width={width}>
                      <Text style={styles.Second}>{clubData.leader.name}</Text>
                    </Fix2>
                </ContainerRow>
                <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>지역구</Text>
                    </Fix1>
                    <Fix2 width={width}>
                      <Text style={styles.Second}>{clubData.region}</Text>
                    </Fix2>
                </ContainerRow>
                <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>최대인원</Text>
                    </Fix1>
                    <Fix2 width={width}>
                      <Text style={styles.Second}>{clubData.maxNumber}</Text>
                    </Fix2>
                </ContainerRow>

            </AllCon>

            <ButtonFix1 width={width}>
              <Button
                color= '#fac8af'
                title="회원 목록          "
                onPress={_handleUserAdminButtonPress}
              />

              <Button
                color= '#fac8af'
                title="          승인 대기"
                onPress={_handleWaitAdminButtonPress}
              />
            </ButtonFix1>

            <ButtonFix2 width={width}>
              <RCButton
                  color= '#fac8af'
                  title="모임 탈퇴"
                  onPress={_handleClubOutButtonPress}    //모임 탈퇴 함수가 필요합니다.
              />
              <RCButton
                  color= '#fac8af'
                  title="모임 삭제"
                  onPress={_handleClubDeleteButtonPress}    //모임 탈퇴 함수가 필요합니다.
              />
              <RCButton
                color= '#fac8af'
                title="정보 수정"
                onPress={_handleMainManageButtonPress}  //모임 정보 수정 화면으로 이동할 예정
              />
            </ButtonFix2>
        </List>
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubMainManage;
