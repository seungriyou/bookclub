//책 둘러보기 화면
//검색어를 입력한 후 제목으로 검색하기, 키워드로 검색하기 버튼을 별개로 이용 가능합니다.
//검색어 입력 전 및 잘못된 검색어 입력 시에는 결과 리스트가 아닌 안내 및 알고리즘 설명 텍스트가 표기됩니다.
//제공되는 데이터는 YES24에 출처를 두고 있으며, 해당 출처는 화면에 표기되었습니다.


import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, Text, Alert } from 'react-native';
import BookRCList from '../components/BookRCList';
import RCButton from '../components/RCButton';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Fortext = styled.View`
  width: ${({ width }) => (width)-60}px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
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
	      return response.json();
	    }).then((responseJson) => {
        const items = responseJson;
        setItems(responseJson);
	    });

	  } catch (error) {
	    Alert.alert("오류", error);
    }
}

//책 키워드 기반 추천
const recommendByKeyword= async () =>{
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
          return response.json();
        }).then((responseJson) => {
          const items = responseJson;
          setItems(responseJson);
        });
      }
      catch (error) {
        Alert.alert("오류", error);
      }
}

    return (
        <Container>
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
              <Text>   </Text>
              <Text>책 검색 규칙은 아래와 같습니다.</Text>
              <Fortext width={width}>
              <Text>   </Text>

                <Text style={{fontSize: 14}} >1. 제목 검색의 경우, 검색어와 책 제목을 비교하여 검색합니다.</Text>
                <Text style={{fontSize: 14}}>1-1. 검색어와 책 제목이 일치할 경우, 해당 책은 추천 결과에서 제외되며 해당 책과 유사한 책을 출력합니다.</Text>
                <Text style={{fontSize: 14}}>1-2. 검색어가 책 제목과 일치하지 않으나 포함될 경우, 해당 책을 포함하여 유사한 책을 출력합니다.</Text>
              <Text>   </Text>
                
                <Text style={{fontSize: 14}}>2. 키워드 검색의 경우, 검색어와 데이터 내 저자/카테고리/태그/키워드 를 비교하여 검색합니다.</Text>
                <Text style={{fontSize: 14}}>2-1. 해당 검색어가 포함된 책들 중 한 권을 랜덤하게 선택하고, 유사한 책을 출력합니다.</Text>
                <Text>   </Text>
                <Text style={{fontSize: 14}}>3. 모든 검색은 책 10권을 출력합니다.</Text>
              
              </Fortext>
            </Container2>
          )
          }
        <FixSource width={width}>
          <Text>제공되는 데이터는 Yes24에 출처를 두고 있습니다</Text>
        </FixSource>
        </Container>
      );
}

export default MyClubBookRC;
