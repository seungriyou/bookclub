//클릭 시 해당 책을 완료한 사람들의 썸네일/이름이 나오도록 하는 Form입니다.
//CompleteUserList.js 컴포넌트를 이용하여 사람들의 정보를 리스트로 받아옵니다.

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import CompleteUserList from './CompleteUserList';



const Container = styled.View`
  max-width: ${({width})=>(width)*0.73}px;
  min-height: 100px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.background};
  padding: 8px
  marginTop: 10px;
  marginLeft: 10px;
  border-radius: 20px;
  border-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background};
  width: 50px;
  height: 50px;
  padding: 8px
  marginTop: 10px;
  marginLeft: 10px;
  border-radius: 20px;
  border-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
`;



const tempData = {
    "member": [
        {
            "id": 1,
            "name": "Michale Jenkinson Violetta",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
        {
            "id": 2,
            "name": "네글자름",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
        {
            "id": 3,
            "name": "멤버B",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
        {
            "id": 4,
            "name": "멤버B",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
        {
            "id": 5,
            "name": "멤버B",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
        {
            "id": 6,
            "name": "멤버B",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
        {
            "id": 7,
            "name": "멤버B",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
        {
            "id": 8,
            "name": "멤버f",
            "profileimg": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4"
        },
    ]    
}




const CompleteUserForm = ({ onPress, clearSearch }) => {
  const width = Dimensions.get('window').width;
  const [isSearch, setIsSearch] = useState(false);
  
  const _switchSearch = () => {
    setIsSearch(!isSearch);
    clearSearch();
  };

  return (
    <>
      {isSearch
        ?
        <Container width={width}>
            <MaterialCommunityIcons
                name="account-details"
                size={30}
                color='#000000'
                onPress={_switchSearch}
            />
            <ScrollView nestedScrollEnabled={true}>
            <CompleteUserList completeuserInfo={tempData} />
            </ScrollView>          
        </Container>
        :
        <ButtonContainer>
          <MaterialCommunityIcons
            name="account-details"
            size={30}
            color='#000000'
            onPress={_switchSearch}
          />
        </ButtonContainer>
      }
    </>
  )
};


export default CompleteUserForm;