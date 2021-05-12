import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { Alert, FlatList, Text, Modal } from 'react-native';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';
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

const MyClubAlbumList = ({navigation, route}) => {
  const [albums, setAlbums] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const id = route.params?.id;
  const title = route.params?.title;

  const _handleAlbumWriteButtonPressed = params => {
    navigation.navigate('MyClubAlbumNav', {screen: 'MyClubAlbum', params: {id: id}});
  };

  const getMyClubAlbumList = async() => {
    try{
      setRefreshing(true);
      const albumRef = DB.collection('clubs').doc(id).collection('album');
      const albumDoc = await albumRef.orderBy('createAt', 'desc').get();
      const list = [];
      albumDoc.forEach(doc => {
        const data = doc.data();
        data['clubId'] = id;
        list.push(data);
      })
      setAlbums(list);

      setRefreshing(false);
    }
    catch(e){
      Alert.alert('앨범 list set error', e.message);
      setRefreshing(false);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTintColor: '#000000',
      headerRight: ({ tintColor }) => (
        <MaterialIcons
          name="edit"
          size={30}
          style={{ marginRight: 13 }}
          color={tintColor}
          onPress={_handleAlbumWriteButtonPressed} //글 등록 버튼 함수(이벤트 추가 필요)
        />
      ),
    });
    //console.log(navigation);
    getMyClubAlbumList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyClubAlbumList();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    console.log(params);
    navigation.navigate('MyClubAlbumNav', {screen: 'MyClubAlbumView', params});
  };

  return (
    <Container>
      <FlatList
        keyExtractor={item => item['id']}
        data={albums}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} />
        )}
        refreshing={refreshing}
        onRefresh={getMyClubAlbumList}
        windowSize={3}
      />

    </Container>
  );
}

export default MyClubAlbumList;
