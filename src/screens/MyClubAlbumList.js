import React, { useContext, useState, useEffect } from 'react';
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

  const id = route.params?.id;
  const title = route.params?.title;

  const _handleAlbumWriteButtonPressed = params => {
    navigation.navigate('MyClubAlbumNav', {screen: 'MyClubAlbum', params: {id: id}});
  };

  useEffect(() => {
    const unsubscribe = DB.collection('clubs').doc(id).collection('album')
      .orderBy('createAt', 'desc')
      .onSnapshot(snapshot => {
        const list = [];
        snapshot.forEach(doc => {
          const data = doc.data()
          data['clubId'] = id;
          list.push(data);
        });
        setAlbums(list);
      });

      return () => unsubscribe();
  }, []);

  useEffect(() => {
    albums.forEach(doc => {
      console.log(doc);
    })
  }, [albums]);

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
        windowSize={3}
      />

    </Container>
  );
}

export default MyClubAlbumList;
