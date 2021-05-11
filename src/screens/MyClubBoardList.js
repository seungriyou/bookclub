import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Alert, FlatList, Text, Modal } from 'react-native';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';
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

const ItemTime = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.listTime};
`;

const ItemAuthor = styled.Text`
  font-size: 12px;
  margin-top: 5px;
  color: ${({ theme }) => theme.listTime};
`;

const getDateOrTime = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};

const Item = React.memo(
  ({ item: { clubId, id, author, title, createAt }, onPress }) => {
    const theme = useContext(ThemeContext);
    const name = author.name;

    return (
      <ItemContainer onPress={() => onPress({ clubId, id, title, author })}>
        <ItemTextContainer>
          <ItemTitle>{title}</ItemTitle>
          <ItemAuthor>{name}</ItemAuthor>
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

const MyClubBoardList = ({navigation, route}) => {
  const [boards, setBoards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const id = route.params?.id;
  const title = route.params?.title;

  const getMyClubBoardList = async() => {
    try{
      setRefreshing(true);
      const boardRef = DB.collection('clubs').doc(id).collection('board');
      const boardDoc = await boardRef.orderBy('createAt', 'desc').get();
      const list = [];
      boardDoc.forEach(doc => {
        const data = doc.data();
        data['clubId'] = id;
        list.push(data);
      })
      setBoards(list);

      setRefreshing(false);
    }
    catch(e){
      Alert.alert('게시판 list set error', e.message);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getMyClubBoardList();
  }, []);

  useEffect(() => {
    boards.forEach(doc => {
      console.log(doc);
    })
  }, [boards]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyClubBoardList();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    console.log(params);
    navigation.navigate('MyClubBoardNav', {screen: 'MyClubBoardView', params});
  };

  return (
    <Container>
      <FlatList
        keyExtractor={item => item['id']}
        data={boards}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} />
        )}
        refreshing={refreshing}
        onRefresh={getMyClubBoardList}
        windowSize={3}
      />

    </Container>
  );
}

export default MyClubBoardList;
