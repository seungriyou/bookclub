//버튼을 클릭 시 해당 책을 완료한 사람들의 프로필이미지/이름이 나오도록 하는 컴포넌트
//완료한 책 목록 리스트를 출력하는 리스트에서 사용되며 CompleteUserList 컴포넌트를 추가로 렌더링 

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



const CompleteUserForm = ({ onPress, clearSearch, members }) => {
  const width = Dimensions.get('window').width;
  const [isSearch, setIsSearch] = useState(false);

  const _switchSearch = () => {
    setIsSearch(!isSearch);
    clearSearch();
  };

  const completeMembers = {
    member: [],
  };

  let index = 1;

  for(let member of members) {
    member.id = index;
    member.profileimg = member.photoUrl;
    completeMembers.member.push(member);
    index = index + 1;
  }

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
            <CompleteUserList completeuserInfo={completeMembers} />
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
