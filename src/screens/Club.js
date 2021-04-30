import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, FlatList, Text, Modal } from 'react-native';
import { getClubInfo, DB, getCurrentUser, clubSignUpWaiting } from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';
import Toast, {DURATION} from 'react-native-easy-toast';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

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

  const user = getCurrentUser();

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
    console.log(members);
    isDisabled(members);
  }, [members]);

  useEffect(() => {
    isDisabled(members);
  })

  const signUpClub = async () => {
    const id = route.params?.id
    try {
      spinner.start();
      clubSignUpWaiting(id);
    } catch (e) {
      Alert.alert('클럽 가입신청 오류', e.message);
    } finally {
      spinner.stop();
      this.toast.show('가입 신청 완료', 1000);

    }

    navigation.popToTop();
  };

  return (
    <Container>
      <Text style={{ fontSize: 24 }}>ID: {route.params?.id}</Text>
      <Text style={{ fontSize: 24 }}>Title: {route.params?.title}</Text>
      <Text style={{ fontSize: 12 }}>{title}</Text>
      <Text style={{ fontSize: 12 }}>{leader.name}</Text>
      <Text style={{ fontSize: 12 }}>{region}</Text>
      <Text style={{ fontSize: 12 }}>{maxNumber}</Text>
      <Button
        title="가입신청"
        onPress={signUpClub}
        disabled={disabled}
      />
      <Toast
        ref={(toast) => this.toast = toast}
        position='bottom'
      />
    </Container>

  );
};

export default Club;
