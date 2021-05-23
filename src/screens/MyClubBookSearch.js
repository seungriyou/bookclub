import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text, Dimensions, Alert } from 'react-native';
import { Input, Button } from '../components';
import {ALADIN_SEARCH_API_KEY} from '../../secret';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parseString } from 'react-native-xml2js';
import BookSearchList from '../components/BookSearchList';
import {decode} from 'html-entities';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const FixBar=styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({width})=>width}px;
  background-color: ${({ theme }) => theme.background};
  padding: 0px 20px 40px 20px;
  borderBottom-color: ${({theme})=>theme.separator};
  borderBottom-width: 1px;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const MyClubBookSearch = ({ navigate, route }) => {
  const id = route.params.id;
  const width= Dimensions.get('window').width;
  const theme = useContext(ThemeContext);
  const [bookname, setBookname] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const _handleSearchButtonPressed = async() => {
    if (bookname !== "") {
      try {
        let list = [];
        const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ALADIN_SEARCH_API_KEY}&Query=${bookname}&QueryType=ItemNewAll&SearchTarget=Book&MaxResults=50&Start=${page}`;
        //console.log(url);
        await fetch(url)
        .then(response => response.text())
        .then(data => {
          parseString(data, function(err, result) {
            //console.log(JSON.stringify(result));
            //console.log(JSON.parse(JSON.stringify(result)));
            if (result.object.item === null) {
              throw "검색 결과가 없습니다.";
            }
            const items = result.object.item;
            let index = 1;
            for(const item of items) {
              let tempDescription = "";
              if(item.description[0].indexOf("<br/>") != -1){
                const temp = item.description[0].split("<br/>");
                tempDescription = decode(temp[1]);
              }
              else{
                tempDescription = decode(item.description[0]);
              }
              const tempData = {
                itemId: index,
                title: item.title[0],
                cover: item.cover[0],
                author: item.author[0],
                description: tempDescription,
                clubId: id,
              }
              list.push(tempData);
              index++;
            }
          });
        });
        setItems(list);
      }
      catch(e) {
        Alert.alert("검색 오류", "검색 결과가 존재하지 않습니다.");
      }
    }
  }

  const _handleNextSearchButtonPressed = async() => {
    setPage(page + 1);
  }

  const _handleResetSearchButtonPressed = async() => {
    setPage(1);
  }

  useEffect(() => {
    _handleSearchButtonPressed();
  }, [page]);

  return (
    <Container width={width}>
      <FixBar width={width}>
        <Input
          placeholder="책 이름을 검색해주세요"
          onChangeText={(text)=>setBookname(text)}
        />
        <Button
          title="검색하기"
          onPress={_handleSearchButtonPressed}
        />
        <Button
          title="다음 검색하기"
          onPress={_handleNextSearchButtonPressed}
        />
        <Button
          title="처음 검색하기"
          onPress={_handleResetSearchButtonPressed}
        />
      </FixBar>

      <List width={width}>
        <BookSearchList bookInfo={items} clubid={id}></BookSearchList>
      </List>
    </Container>
  );
};

export default MyClubBookSearch;
