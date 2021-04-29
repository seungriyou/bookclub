import React, { useContext, useState, useEffect } from 'react';
import { DB, getCurrentUser } from '../utils/firebase';
import { FlatList, Alert } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;
const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.listBorder};
  padding: 15px 20px;
`;
const ItemTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;
const ItemTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;
const ItemDescription = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  color: ${({ theme }) => theme.listTime};
`;
const ItemTime = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.listTime};
`;

const getDateOrTime = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};

const Item = React.memo(
  ({ item: { id, title, description, createAt }, onPress }) => {
    const theme = useContext(ThemeContext);

    return (
      <ItemContainer onPress={() => onPress({ id, title })}>
        <ItemTextContainer>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemTextContainer>
        <ItemTime>{getDateOrTime(createAt)}</ItemTime>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={theme.listIcon}
        />
      </ItemContainer>
    );
  }
);

const MyClubList = ({ navigation }) => {
  const [clubIds, setClubIds] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [doc, setDoc] = useState({});

  const user = getCurrentUser();
  const getMyClubId = async () => {
    try {
      const userRef = DB.collection('users');
      const snapshot = await userRef.where('uid', '==', user.uid).get();
      snapshot.forEach(doc => {
        console.log(doc.data());
        setDoc(doc.data());
      })
      console.log("doc data test");
    }
    catch(e) {
      Alert.alert('클럽 데이터 수신 오류', e.message);
    }
  };

  const getMyClubList = async () => {
    try {
      const clubRef = DB.collection('clubs');
      const list = [];
      for(const clubId in clubIds){
        const tempDoc = await clubRef.doc(clubId).get();
        const tempData = tempDoc.data();
        list.push(tempData);
      }
      setClubs(list);
    }
    catch (e) {
      Alert.alert('클럽 list set error', e.message);
    }
  };

  useEffect(() => {
    getMyClubId();
  }, []);

  useEffect(() => {
    setClubIds(doc.club);
  }, [doc]);

  useEffect(() => {
    getMyClubList();
  }, [clubIds])

  useEffect(() => {
    console.log(clubs);
  }, [clubs]);

  const _handleItemPress = params => {
    navigation.navigate('Club', params);
  };

  return (
    <Container>
      <FlatList
        keyExtractor={item => item['id']}
        data={clubs}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} />
        )}
        windowSize={3}
      />
    </Container>
  );
};

export default MyClubList;
