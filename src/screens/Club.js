import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions, FlatList, StyleSheet, Text, Modal } from 'react-native';
import { getClubInfo, DB, getCurrentUser, clubSignUpWaiting } from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';
import { theme } from '../theme';



const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  width: ${({ width }) => width}px;
  border-Width: 3px;
  border-Color: ${({ theme }) => theme.appBackground};

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
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
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
  const { spinner } = useContext(ProgressContext);
  const [title, setTitle] = useState('');
  const [leader, setLeader] = useState({
    name: "",
    photoUrl: "",
  });
  const [members, setMembers] = useState([]);
  const [region, setRegion] = useState('');
  const [maxNumber, setMaxNumber] = useState(0);
  const [id, setId] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [description, setDescription] = useState('');
  const [num, setNum] = useState(0);

  const user = getCurrentUser();

  const width = Dimensions.get('window').width;


  const getClub = async () => {
    try {
      const clubData = await getClubInfo(route.params?.id);
      setId(route.params?.id);
      setTitle(clubData.title);
      setLeader({
        name: clubData.leader.name,
        photoUrl: clubData.leader.photoUrl
      });
      setMembers([...members, ...clubData.members]);
      setRegion(clubData.region);
      setMaxNumber(clubData.maxNumber);
      setDescription(clubData.description);
      setNum(clubData.members.length);
    } catch (e) {
      Alert.alert('클럽 데이터 수신 오류', e.message);
    }
  };

  const isDisabled = (members) => {
      let temp = false;
      members.forEach(member => {
        if (member.uid == user.uid) {
          temp = true;
        }
      });
      if(temp == true) {
        setDisabled(true);
      }
  };

  useEffect(() => {
    getClub();
  }, []);

  useEffect(() => {
    isDisabled(members);
  }, [members]);

  useEffect(() => {
    isDisabled(members);
  })

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

        for (const member of waiting) {
          if (member.id === user.uid) {
            flag = false;
          }
        }
        console.log(flag);
        if (flag == true) {
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

      Alert.alert('가입신청 완료');
    } catch (e) {
      Alert.alert('클럽 가입신청 오류', e.message);
    } finally {
      spinner.stop();
    }

    navigation.popToTop();
  };

  return (
    <Container width={width}>

      <TitleCon width={width}>
        <Text style={styles.First}>{title}</Text>
      </TitleCon>
      <AllCon width={width}>

      <Text style={styles.Second}>{description}</Text>
      <Line width={width}></Line>
      <Text style={styles.Second}>관리자:  {leader.name}</Text>
      <Line width={width}></Line>
      <Text style={styles.Second}>지역구:  {region}</Text>
      <Line width={width}></Line>
      <Text style={styles.Second}>모임형태:  모임형태의 위치입니다.</Text>
      <Line width={width}></Line>
      <Text style={styles.Second}>인원 수 :  {num}/{maxNumber}</Text>

      </AllCon>
      <Button
        title="가입신청"
        onPress={signUpClub}
        disabled={disabled}
      />
    </Container>

  );
};

export default Club;
