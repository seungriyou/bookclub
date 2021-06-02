import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Dimensions, Alert } from 'react-native';
import { Input, Button } from '../components';
import {ALADIN_SEARCH_API_KEY} from '../../secret';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import BookRCList from '../components/BookRCList';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
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

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
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

const SearchButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress} >
      <MaterialIcons
        name="search"
        size={35}
      />
    </ButtonContainer>
  );
};


const tempData = {
  "searchlist" : [
    {
      "id": 1,
      "title": "사과 아래에서 보내는 시간",
      "author": "헤르만 헤세 스티븐 호킹",
      "rating": 9.5,
      "image": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
    },
    {
      "id": 2,
      "title": "햇살 좋은 날 보는 별",
      "author": "별든날",
      "rating": "NaN",
      "image": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
    },
  ]
}





const MyClubBookRC = ({ navigate, route }) => {
  const width = Dimensions.get('window').width;
  const [searchword, setsearchword] = useState("");

  const id = route.params.id;

//책 제목 기반 추천
const recommendByTitle = () => {
  console.log(searchword);
	try {
	  fetch (
	    'http://ec2-3-14-126-126.us-east-2.compute.amazonaws.com:5000/title',
	    {
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json'
	      },
	      method: 'POST',
	      body: JSON.stringify({
	        input: 'searchword'
	      })
	    }).then((response) => {
	      console.log(JSON.stringify(response));
	      return response.json();
	    }).then((responseJson) => {
	      console.log(responseJson);
	    });
	  } catch (error) {
	    console.log(error);
	  }
}

//저자, 카테고리, 키워드 기반 추천
const recommendByKeyword = () => {
	try {
	  fetch (
	    'http://ec2-3-14-126-126.us-east-2.compute.amazonaws.com:5000/keyword',
	    {
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json'
	      },
	      method: 'POST',
	      body: JSON.stringify({
	        input: 'searchword'
	      })
	    }).then((response) => {
	      console.log(JSON.stringify(response));
	      return response.json();
	    }).then((responseJson) => {
	      console.log(responseJson);
	    });
	  } catch (error) {
	    console.log(error);
	  }
}



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
              onChangeText={(text)=>setsearchword(text)}
            />
            <SearchButton onPress={recommendByTitle} />
        </FixBar>
          <List width={width}>
          <BookRCList bookInfo={tempData} clubid={id}></BookRCList>
          </List>
        </Container>
      );
}

export default MyClubBookRC;
