import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Alert, FlatList, Text, Modal } from 'react-native';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import { Button } from '../components';
import { ProgressContext } from '../contexts';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import SearchForm from '../components/SearchForm';

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


const MyClubEssayList = ({navigation, route}) => {
  const [essays, setEssays] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');


  const id = route.params?.id;

  const getMyClubEssayList = async() => {
    try{
      setRefreshing(true);
      const essayRef = DB.collection('clubs').doc(id).collection('essay');
      const essayDoc = await essayRef.orderBy('createAt', 'desc').get();
      const list = [];
      essayDoc.forEach(doc => {
        const data = doc.data();
        data['clubId'] = id;
        list.push(data);
      })
      setEssays(list);

      setRefreshing(false);
    }
    catch(e){
      Alert.alert('에세이 list set error', e.message);
      setRefreshing(false);
    }
  }

  const getEssaySearchData = async() => {
    try{
      setRefreshing(true);
      const essayRef = DB.collection('clubs').doc(id).collection('essay');
      const essayDoc = await essayRef.orderBy('createAt', 'desc').get();
      const list = [];
      essayDoc.forEach(doc => {
        const data = doc.data();
        if(data.title.includes(search)){
          data['clubId'] = id;
          list.push(data);
        }
      })
      setEssays(list);

      setRefreshing(false);
    }
    catch(e){
      Alert.alert('에세이 search error', e.message);
      setRefreshing(false);
    }
  }

  useLayoutEffect(() => {
    getMyClubEssayList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyClubEssayList();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    navigation.navigate('MyClubEssayNav', {screen: 'MyClubEssayView', params});
  };

  /* 검색폼 부분. 검색하는 기능과 연동 필요 */
  const _handleSearchChange = text => {
    setSearch(text);
  };
  
  const _searchPost = () => {
    if (!search) {
      alert("검색어를 입력해주세요.");
    }
    else {
      alert(`검색합니다: ${search}`);
      getEssaySearchData();
      //setSearch('');
    }
  };

  const _clearSearch = () => {
    setSearch('');
  };


  return (
    <Container>
      <FlatList
        keyExtractor={item => item['id']}
        data={essays}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} />
        )}
        refreshing={refreshing}
        onRefresh={getMyClubEssayList}
        windowSize={3}
      />
      <SearchForm
        placeholder="검색어를 입력하세요."
        value={search}
        onChangeText={_handleSearchChange}
        onSubmitEditing={() => { }}
        onPress={_searchPost}
        clearSearch={_clearSearch}
      />
    </Container>
  );
}

export default MyClubEssayList;
