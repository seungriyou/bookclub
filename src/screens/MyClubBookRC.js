import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, Text, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BookRCList from '../components/BookRCList';
import RCButton from '../components/RCButton';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Containerrow = styled.View`
  background-color: ${({ theme }) => theme.background};
  flex-direction: row;
`;


const Container2 = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  paddingTop: 20px;
`;



const FixSource=styled.View`
  width: ${({ width }) => width}px;
  height: 40px;
  background-color: ${({ theme }) => theme.background};
  borderTop-color: ${({theme})=>theme.separator};
  borderTop-width: 1px;
  position: absolute;
  bottom: 0;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const FixBar=styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({width})=>width}px;
  background-color: ${({ theme }) => theme.background};
  padding: 10px 20px 10px 20px;
  borderTop-color: ${({theme})=>theme.separator};
  borderTop-width: 1px;
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
  width: ${({ width }) => width - 40}px;
  margin: 10px 10px;
  padding: 10px 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.search};
  font-size: 17px;
  color: ${({ theme }) => theme.text};
`;




const MyClubBookRC = ({ navigate, route }) => {
  const width = Dimensions.get('window').width;
  const [searchword, setSearchword] = useState("");
  const [items, setItems] = useState([]);

  const id = route.params.id;


//책 제목 기반 추천
const recommendByTitle = () => {
  //console.log(searchword);
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
	        input: searchword
	      })
	    })
      .then((response) => {
	      //console.log(JSON.stringify(response));
	      return response.json();
	    }).then((responseJson) => {
	      //console.log(responseJson);
        const items = responseJson;
        setItems(responseJson);
        //console.log(items);
	    });

	  } catch (error) {
	    Alert.alert("오류", error);
    }
}

//책 키워드 기반 추천
const recommendByKeyword= async () =>{
  //console.log(searchword);

    try {
      const res = await fetch (
        'http://ec2-3-14-126-126.us-east-2.compute.amazonaws.com:5000/keyword',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            input: searchword
          })
        }).then((response) => {
          //console.log(JSON.stringify(response));
          return response.json();
        }).then((responseJson) => {
          //console.log(responseJson);
          const items = responseJson;
          setItems(responseJson);
          //console.log(items);
        });
      }
      catch (error) {
        Alert.alert("오류", error);
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
              onChangeText={(text)=>setSearchword(text)}
            />
            <Containerrow>
              <RCButton
                title="제목으로 검색하기"
                onPress={recommendByTitle} />
              <RCButton
                title="키워드로 검색하기"
                onPress={recommendByKeyword} />
            </Containerrow>
        </FixBar>

          {items.length > 0 ? (
          <List width={width}>
          <BookRCList bookInfo={items} clubid={id}></BookRCList>
          </List>
          ) :(
            <Container2>

              <Text>데이터에 없는 검색어가 입력될 시 책 추천이 불가합니다.</Text>
              <Text>유의하여 검색하여주세요.</Text>
            </Container2>
          )
          }
        <FixSource width={width}>
          <Text>데이터 출처: Yes24</Text>
        </FixSource>
        </Container>
      );
}

export default MyClubBookRC;
