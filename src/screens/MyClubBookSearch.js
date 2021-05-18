import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text } from 'react-native';
import { Input, Button } from '../components';
import {ALADIN_SEARCH_API_KEY} from '../../secret';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parseString } from 'react-native-xml2js';

const Container = styled.View`
flex: 1;
justify-content: center;
align-items: center;
background-color: ${({ theme }) => theme.background};
padding: 0 20px;

`;

const MyClubBookSearch = ({ navigate, route }) => {
  const theme = useContext(ThemeContext);
  const [bookname, setBookname] = useState("");
  const [result, setResult] = useState({});

  const _handleSearchButtonPressed = async() => {
    try {
      const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ALADIN_SEARCH_API_KEY}&Query=${bookname}`;
      console.log(url);
      await fetch(url)
      .then(response => response.text())
      .then(data => {
        parseString(data, function(err, result) {
          console.log(JSON.stringify(result));
          console.log(JSON.parse(JSON.stringify(result)));
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
    <Container>
      <Input
        label="bookName"
        placeholder="책 이름"
        onChangeText={(text)=>setBookname(text)}
      />
      <Button
        title="검색하기"
        onPress={_handleSearchButtonPressed}
      />


    </Container>
  );
};

export default MyClubBookSearch;
