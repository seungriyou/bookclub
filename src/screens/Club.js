import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, FlatList, Text } from 'react-native';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';

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

  const user = getCurrentUser();

  const getClub = async () => {
    try {
      const clubData = await getClubInfo(route.params?.id);
      setTitle(clubData.title);
      setLeader({
        name: clubData.leader.name,
        photoUrl: clubData.leader.photoUrl
      });
      setMembers(clubData.members);
      setRegion(clubData.region);
      setMaxNumber(clubData.maxNumber);
    } catch (e) {
      Alert.alert('클럽 데이터 수신 오류', e.message);
    }
  }

  const getIsMember = (user) => {
    console.log("getIsMember on");
    console.log(members);
    const index = members.findIndex( obj => obj.uid == user.uid );
    if(index != -1) {setIsMember(true)}
    console.log(isMember);
  }

  useEffect(() => {
    getClub();
    getIsMember(user);
  }, []);

  const Item = ({ uid, isWaiting }) => {
      console.log(uid);
      console.log(isWaiting);
      return (
        <Text>uid: {uid} / isWaiting: {isWaiting}</Text>
      );
  };

  return (
    <Container>
      <Text style={{ fontSize: 24 }}>ID: {route.params?.id}</Text>
      <Text style={{ fontSize: 24 }}>Title: {route.params?.title}</Text>
      <Text style={{ fontSize: 12 }}>{title}</Text>
      <Text style={{ fontSize: 12 }}>{leader.name}</Text>
      <Text style={{ fontSize: 12 }}>{region}</Text>
      <Text style={{ fontSize: 12 }}>{maxNumber}</Text>
      <FlatList
        data={members}
        renderItem={item => <Item uid={item.uid} isWaiting={item.isWaiting} />}
        keyExtractor={item => item['uid'].toString()}
      />
    </Container>
  );
};

export default Club;
