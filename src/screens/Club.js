import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, FlatList, Text } from 'react-native';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import { Button } from '../components';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const Club = ({ route }) => {
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
      members.forEach(member => {
        if (member.uid == user.uid && member.isWaiting == false) {
          setDisabled(true);
        }
      });
  };

  useEffect(() => {
    getClub();
  }, []);

  useEffect(() => {
    console.log(members);
    isDisabled(members);
  }, [members]);

  const signUpClub = () => {};

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
    </Container>
  );
};

export default Club;
