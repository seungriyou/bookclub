//클럽 목록 탭에서 특정 클럽을 클릭했을 때 클럽 정보를 조회하는 화면
//클럽 이름/클럽 소개글/관리자닉네임/지역구/인원 수(현재/총) 를 표기합니다.
//가입 신청 기능을 실행 가능하며, 이미 신청되었을 경우 알림을 띄웁니다.

import React, { useContext, useState, useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions, StyleSheet, Text} from 'react-native';
import { DB, getCurrentUser} from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';
import { theme } from '../theme';

const Container = styled.View`
  background-color: ${({ theme }) => theme.background};
  width: ${({ width }) => width}px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  borderTop-Width: 3px;
  borderTop-Color: ${({ theme }) => theme.appBackground};
  paddingTop: 40px;
  paddingBottom: 60px;
`;

const Con=styled.View`
flex: 1;
background-color: ${({theme})=>theme.background};
`;


const TitleCon=styled.View`
  background-color: ${({ theme }) => theme.background};
  border-Width: 2.5px;
  border-Color: ${({ theme }) => theme.appBackground};
  min-width: ${({ width }) => (width)*0.6}px;
  max-width: ${({ width }) => (width)*0.7}px;
  justify-content: center;
  align-items: center;
  marginBottom: 50px;
  border-radius: 10px;
`;

const AllCon=styled.View`
  background-color: ${({ theme }) => theme.background};
  border-Width: 2.5px;
  border-Color: ${({ theme }) => theme.appBackground};
  width: ${({ width }) => (width)*0.85}px;
  paddingLeft: 10px;
  paddingRight: 10px;
  paddingBottom: 7px;
  marginBottom: 50px;
  border-radius: 10px;
`;

const Line=styled.View`
  background-color: ${({ theme }) => theme.separator};
  height: 0.8px;
  width: ${({ width }) => ((width)*0.8)-10}px;
`;

const List = styled.ScrollView`
    flex: 1;
    width: ${({ width }) => (width)}px;
`;


const styles = StyleSheet.create({
  First: {
    fontSize: 28,
    color: theme.text,
    fontWeight: "bold",
    padding: 10,
  },
  Second:{
    fontSize: 16,
    color: theme.text,
    paddingTop: 14,
    paddingBottom: 7,
    paddingLeft: 7,
  },
  Img: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});




const Club = ({ navigation, route }) => {
  const clubId = route.params.id;
  const { spinner } = useContext(ProgressContext);
  const [clubData, setClubData] = useState({
    id: clubId,
    title: "",
    description: "",
    leader: {
      name: "",

    },
    region: "",
    maxNumber: 0,
    members: [],
  });
  const [disabled, setDisabled] = useState(true);

  const user = getCurrentUser();

  const width = Dimensions.get('window').width;


  const getClub = async () => {
    try {
      const clubRef = DB.collection('clubs').doc(clubId);
      const clubDoc = await clubRef.get();
      const tempClubData = clubDoc.data();

      let temp = false;
      tempClubData.members.forEach(member => {
        if (member.uid === user.uid) {
          temp = true;
        }
      });

      if(temp == true || parseInt(tempClubData.maxNumber, 10) === tempClubData.members.length) {
        setDisabled(true);
      }
      else {
        setDisabled(false);
      }

      setClubData(tempClubData);
    } catch (e) {
      Alert.alert('클럽 데이터 수신 오류', e.message);
    }
  };

  useLayoutEffect(() => {
    getClub();
  }, []);

  const signUpClub = async () => {
    const id = route.params?.id
    try {
      spinner.start();
      const clubRef = DB.collection('clubs').doc(id);

      await DB.runTransaction(async (t) => {
        const clubDoc = await t.get(clubRef);
        const clubData = clubDoc.data();
        const waiting = clubData.waiting;

        let flag = true;
        if (waiting.length !== 0) {
          for (const member of waiting) {
            if (member.uid === user.uid) {
              flag = false;
            }
          }
        }

        if (flag === true) {
          waiting.push({
            uid: user.uid,
            email: user.email,
            photoUrl: user.photoUrl,
            name: user.name
          });
        }
        else {
          throw new Error("이미 가입 신청 대기중입니다.");
        }

        t.update(clubRef, {waiting: waiting});
      });

      const userRef = DB.collection('users').doc(user.uid);

      await DB.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        const userData = userDoc.data();

        const club = userData.club;
        club[id] = false;

        t.update(userRef, {club: club});
      });

      Alert.alert('가입신청이 완료되었습니다.');
    } catch (e) {
      Alert.alert('클럽 가입신청 오류', e.message);
    } finally {
      spinner.stop();
    }

    navigation.popToTop();
  };

  return (
    <Con>
    <List width={width}>
    <Container width={width}>
        <TitleCon width={width}>
          <Text style={styles.First}>{clubData.title}</Text>
        </TitleCon>
        <AllCon width={width}>

        <Text style={styles.Second}>{clubData.description}</Text>
        <Line width={width}></Line>
        <Text style={styles.Second}>관리자:  {clubData.leader.name}</Text>
        <Line width={width}></Line>
        <Text style={styles.Second}>지역구:  {clubData.region}</Text>
        <Line width={width}></Line>
        <Text style={styles.Second}>인원 수 :  {clubData.members.length}/{clubData.maxNumber}</Text>

        </AllCon>
        <Button
          title="가입신청"
          onPress={signUpClub}
          disabled={disabled}
        />
    </Container>
    </List>
    </Con>
  );
};

export default Club;
