import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text, Dimensions } from 'react-native';
import { Input, Button } from '../components';
import {ALADIN_SEARCH_API_KEY} from '../../secret';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parseString } from 'react-native-xml2js';
import BookSearchList from '../components/BookSearchList';


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

const tempData = {

  "object": [
    {
      "itemId": 1,
      "title": "부유하는 매실",
      "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
      "author": "나츠메 소세키",
      "description": "자연과 사람이 함께 살아가는 모습을 꿈꾸는 '채인선×김진만의 환경 다큐 그림책'이 출간되었다. 김진만 피디의 참신한 기획, 채인선 작가의 따뜻한 시선, MBC 다큐멘터리 '남극의 눈물'의 감동적인 황제펭귄 사진이 만나 ‘ 환경 다큐 그림책’을 만들어 냈다."
    },
    {
      "itemId": 2,
      "title": "잠들지 않는 새벽",
      "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
      "author": "달그림자",
      "description": "대부분의 소개글이 윗 칸과 같은 분량을 지니는 것으로 보여 최소높이를 윗 칸 기준으로 잡았습니다."
    },
    {
      "itemId": 3,
      "title": "가장 차가운 것",
      "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
      "author": "벽난로",
      "description": "실제로 알라딘 API를 렌더링한 flatlist를 가져올 경우, 이 공간에는 여백이 자리했다가 '검색하기'버튼을 누른 후에 flatlist가 생성됩니다."
    },
    {
      "itemId": 4,
      "title": "탈수",
      "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
      "author": "에비앙",
      "description": "코로나19가 정말 걸리면 큰일이 나는 위험한 것인가? 코로나19와 가장 밀접한 곳에서 일하고 있는 응급의학과 의사인 저자의 경험담과 생각은, 우리가 코로나19에 대해 아무렇지도 않게 무심코 받아들인 정보들과 상황들이 과연 모두 맞는 건지 의구심을 가지게 한다."
    },
    {
      "itemId": 5,
      "title": "라일락",
      "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
      "author": "무지개",
      "description": "라벤더와 착각하고 있지는 않으신가요?"
    },
  ]
}




const MyClubBookSearch = ({ navigate, route }) => {
  const width= Dimensions.get('window').width;
  const theme = useContext(ThemeContext);
  const [bookname, setBookname] = useState("");
  const [result, setResult] = useState({});


  const _handleSearchButtonPressed = async() => {
    try {
      const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ALADIN_SEARCH_API_KEY}&Query=${bookname}`;
      //console.log(url);
      await fetch(url)
      .then(response => response.text())
      .then(data => {
        parseString(data, function(err, result) {
          //console.log(JSON.stringify(result));
          //console.log(JSON.parse(JSON.stringify(result)));
          setResult(JSON.parse(JSON.stringify(result)));
          console.log(result);
        })
      });
      }
      catch(e) {
        console.log(e.message);
      }
  }

  useState(()=> {
    console.log(result);
  }, [result]);


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
      </FixBar>

      <List width={width}>
        <BookSearchList bookInfo={tempData.object}></BookSearchList>
      </List>
    </Container>
  );
};

export default MyClubBookSearch;
