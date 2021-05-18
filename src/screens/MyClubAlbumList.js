import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { Alert, FlatList, Text, Modal, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';
import styled, { ThemeContext } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { theme } from '../theme';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
`;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: column;
  width: ${({ width }) => (width - 40) / 2}px;
  align-items: flex-start;
  padding: 10px 10px;
  margin: 10px 5px;
`;
const ItemTextContainer = styled.View`
  width: ${({ width }) => (width - 40) / 2 - 20}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;
const ItemTitle = styled.View`
  justify-content: center;
  margin-top: 10px;
`;
const ItemTime = styled.View`
  align-items: flex-end;
  width: 45px;
`;
const ItemAuthor = styled.View`
  align-items: flex-start;
  width: ${({ width }) => (width - 40) / 2 - 65}px;
`;

const getDateOrTime = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};

const Item = React.memo(
  ({ item: { clubId, id, author, title, createAt, photoUrls }, onPress, width }) => {
    const theme = useContext(ThemeContext);
    const name = author.name;

    return (
      <ItemContainer width={width} onPress={() => onPress({ clubId, id, title, author })}>
        <Image
          style={{ height: (width-40)/2-20, width: (width-40)/2-20, borderRadius: 10 }}
          source={{ uri: photoUrls[0] }}
          key={id}
          resizeMethod="resize"
        />
        <ItemTitle><Text numberOfLines={1} style={styles.itemTitle}>{title}</Text></ItemTitle>
        <ItemTextContainer width={width}>
          <ItemAuthor width={width}><Text numberOfLines={1} style={styles.ItemAuthor}>{name}</Text></ItemAuthor>
          <ItemTime><Text style={styles.itemTime}>{getDateOrTime(createAt)}</Text></ItemTime>
        </ItemTextContainer>
      </ItemContainer>
    );
  }
);

const MyClubAlbumList = ({navigation, route}) => {
  const width = useWindowDimensions().width;

  const [albums, setAlbums] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const id = route.params?.id;
  const title = route.params?.title;

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
    getMyClubAlbumList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyClubAlbumList();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    navigation.navigate('MyClubAlbumNav', {screen: 'MyClubAlbumView', params});
  };

  return (
    <Container>
      <FlatList
        keyExtractor={item => item['id'].toString()}
        data={albums}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} width={width} />
        )}
        refreshing={refreshing}
        onRefresh={getMyClubAlbumList}
        windowSize={3}
        numColumns={2}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemTime: {
    fontSize: 13,
    marginTop: 3,
    color: theme.listTime,
  },
  ItemAuthor: {
    fontSize: 13,
    marginTop: 3,
    color: theme.listTime,
  },
});

export default MyClubAlbumList;
