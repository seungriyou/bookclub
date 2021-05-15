//클럽의 회원 목록을 조회하는 화면
//모임장의 멤버 강퇴 함수가 필요합니다.


import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import UserAdminList from '../components/UserAdminList';



const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const Header=styled.View` 
    width: ${({width})=>width}px;
    height: 120px;
    background-color: ${({theme})=>theme.background};    
    flex-direction: row;
    align-items: center;
    justify-content: center;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    borderBottom-color: ${({theme})=>theme.appBackground};
    borderBottom-width: 3px;
    padding: 0;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;


const styles = StyleSheet.create({
    clubname: {
      fontSize: 25,
      color: theme.text,
    },
    processText: {
      fontSize: 16,
      color: theme.text,
      padding: 3,
      marginLeft: 10,
      marginVertical: 7, 
      backgroundColor: theme.background,
    },
    bookimg: {
        width: 70,
        height: 100,
    },
  });


const MainHeader= ({clubname})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
        <Text style={styles.clubname}>{clubname}</Text>
        </Header>
    )
};


const tempData = {
    "userlist": [
      {
        "id": 1,
        "user_name": "김수한무",
        "img_url": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
        "user_mail": "abdfdfdfdfdfdfdfdfdfc@gmail.com"

      },
      {
        "id": 2,
        "user_name": "멤버B",
        "img_url": "http://drive.google.com/uc?export=view&id=1psgmqUpSA_Mgrxw-5RY2cMSpDI_TKmuM",
        "user_mail": "def@gmail.com"

      },
      {
        "id": 3,
        "user_name": "멤버C",
        "img_url": "http://drive.google.com/uc?export=view&id=1Z-kttQHMB-kMHQ_3cyKqroT3paw_PJ1k",
        "user_mail": "ghi@gmail.com"
       
      },
      {
        "id": 4,
        "user_name": "멤버D",
        "img_url": "http://drive.google.com/uc?export=view&id=1n1zQxO4FfO_Q4LUYcWR6tuXoI8UepvDJ",
        "user_mail": "jkl@gmail.com"
        
      },
      {
        "id": 5,
        "user_name": "멤버E",
        "img_url": "http://drive.google.com/uc?export=view&id=1877gatJkVEbpzp9TL897--_Fj1oYrOZ2",
        "user_mail": "mno@gmail.com"
       
      },
      {
        "id": 6,
        "user_name": "멤버F",
        "img_url": "http://drive.google.com/uc?export=view&id=1VDKn12Lw17MQ4tEmL8kMhDtL7kqTjwkS",
        "user_mail": "pqr@gmail.com"
       
      },
      {
        "id": 7,
        "user_name": "멤버G",
        "img_url": "http://drive.google.com/uc?export=view&id=1_TNsKJatqW3PYWwByqDW_RDQ2qvMfrhY",
        "user_mail": "stu@gmail.com"
       
      },
      {
        "id": 8,
        "user_name": "멤버H",
        "img_url": "http://drive.google.com/uc?export=view&id=1nuoptwRc_kqQdm_xqPzPkaPK-tG0u_08",
        "user_mail": "vwx@gmail.com"
       
      },
      
    ]
}


const MyClubUserAdmin=({ navigation })=>{

    const width= Dimensions.get('window').width;


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
            headerLeft: ({onPress, tintColor})=>{
                return(
                    <MaterialCommunityIcons
                        name="keyboard-backspace"
                        size={30}
                        style={{marginLeft:13}}
                        color={tintColor}
                        onPress={onPress}   //추후수정-뒤로가기
                    />
                );
            },
        });
      console.log(navigation);
    }, []);

    
    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader clubname="SEORAP"></MainHeader>

            <List width={width}>
              <UserAdminList userInfo={tempData}></UserAdminList>
            </List>
            
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubUserAdmin;