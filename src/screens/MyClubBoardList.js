//게시판 게시글 목록 화면

import React, { useContext, useState, useEffect } from 'react';
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

const MyClubBoardList = ({navigation, route}) => {
  const [boards, setBoards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOption, setSearchOption] = useState('title');

  const id = route.params?.id;
  const title = route.params?.title;

  const getMyClubBoardList = async() => { //클럽의 게시물 데이터 수신 함수
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
      Alert.alert('게시판 리스트 수신 오류', e.message);
      setRefreshing(false);
    }
  }

  const getBoardSearchData = async() => { //게시글 검색 함수
    try{
      setRefreshing(true);
      const boardRef = DB.collection('clubs').doc(id).collection('board');
      const boardDoc = await boardRef.orderBy('createAt', 'desc').get();
      const list = [];
      if(searchOption === 'title') {
        boardDoc.forEach(doc => {
          const data = doc.data();
          if(data.title.includes(search.trim())){
            data['clubId'] = id;
            list.push(data);
          }
        })
      }
      else if(searchOption === 'author') {
        boardDoc.forEach(doc => {
          const data = doc.data();
          if(data.author.name.includes(search.trim())){
            data['clubId'] = id;
            list.push(data);
          }
        })
      }

      setBoards(list);

      setRefreshing(false);
    }
    catch(e){
      Alert.alert('게시판 검색 오류', e.message);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getMyClubBoardList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyClubBoardList();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    navigation.navigate('MyClubBoardNav', {screen: 'MyClubBoardView', params});
  };

  const _handleSearchChange = text => {
    setSearch(text);
  };

  const _searchPost = () => {
    if (!search) {
      Alert.alert('오류', "검색어를 입력해주세요.");
    }
    else {
      //Alert.alert('알림', ((searchOption==='title') ? '제목으로 ' : '글쓴이로 ') + `검색합니다 : ${search}`);
      getBoardSearchData();
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
        data={boards}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} />
        )}
        refreshing={refreshing}
        onRefresh={getMyClubBoardList}
        windowSize={3}
      />
      <SearchForm
        placeholder="검색어를 입력하세요."
        value={search}
        onChangeText={_handleSearchChange}
        onSubmitEditing={_searchPost}
        onPress={_searchPost}
        clearSearch={_clearSearch}
        onChangeSearchOption={(value) => {setSearchOption(value)}}
      />
    </Container>
  );
}

export default MyClubBoardList;
