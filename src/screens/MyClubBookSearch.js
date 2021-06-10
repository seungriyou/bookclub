//모임장만이 접근 가능한 도서 등록 화면
//제공되는 데이터는 알라딘에서 제공한 알라딘 API에 출처를 두고 있으며, 해당 출처는 화면에 표기되었습니다.


import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text, Dimensions, Alert } from 'react-native';
import {ALADIN_SEARCH_API_KEY} from '../../secret';
import { parseString } from 'react-native-xml2js';
import BookSearchList from '../components/BookSearchList';
import {decode} from 'html-entities';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
`;
const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  width: ${({ width }) => width - 80}px;
  margin: 10px 10px;
  padding: 10px 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.search};
  font-size: 17px;
  color: ${({ theme }) => theme.text};
`;
const FixBar=styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${({width})=>width}px;
  background-color: ${({ theme }) => theme.background};
  padding: 10px 20px 10px 20px;
  borderBottom-color: ${({theme})=>theme.separator};
  borderBottom-width: 1px;
`;

const FixSource=styled.View`
  width: ${({ width }) => width}px;
  height: 40px;
  background-color: ${({ theme }) => theme.background};
  borderTop-color: ${({theme})=>theme.separator};
  borderTop-width: 1px;
  position: absolute;
  bottom: 65;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
`;

const PageButtonContainer = styled.TouchableOpacity`
  width: ${({width})=>width/2}px;
  height: 50px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
`;

const PageButtonArea = styled.View`
  flex-direction: row;
  padding: 7px;
  justify-content: space-between;
  borderTop-color: ${({theme})=>theme.separator};
  borderTop-width: 1px;
`;

const SearchButtonIcon = () => {
  return (
    <MaterialIcons
      name="search"
      size={35}
    />
  );
};

const SearchButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress} >
      <SearchButtonIcon />
    </ButtonContainer>
  );
};

const ResetPageButtonIcon = () => {
  return (
    <MaterialCommunityIcons
      name="chevron-double-left"
      size={40}
    />
  );
};

const ResetPageButton = ({ onPress, width }) => {
  return (
    <PageButtonContainer onPress={onPress} width={width} >
      <ResetPageButtonIcon />
    </PageButtonContainer>
  );
};

const NextPageButtonIcon = () => {
  return (
    <MaterialCommunityIcons
      name="chevron-right"
      size={40}
    />
  );
};

const NextPageButton = ({ onPress, width }) => {
  return (
    <PageButtonContainer onPress={onPress} width={width}>
      <NextPageButtonIcon />
    </PageButtonContainer>
  );
};


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
        await fetch(url)
        .then(response => response.text())
        .then(data => {
          parseString(data, function(err, result) {
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
        <StyledInput
          width={width}
          placeholder="책 이름을 검색해주세요"
          maxLength={30}
          multiline={false}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onChangeText={(text)=>setBookname(text)}
        />
        <SearchButton onPress={_handleSearchButtonPressed} />
      </FixBar>
      <List width={width}>
        <BookSearchList bookInfo={items} clubid={id}></BookSearchList>
      </List>
      <FixSource width={width}>
        <Text>알라딘에서 제공되는 알라딘 API가 적용되어 있습니다</Text>
      </FixSource>
      <PageButtonArea>
        <ResetPageButton onPress={_handleResetSearchButtonPressed} width={width} />
        <NextPageButton onPress={_handleNextSearchButtonPressed} width={width} />
      </PageButtonArea>
    </Container>
  );
};

export default MyClubBookSearch;
