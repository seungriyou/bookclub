//클럽 내 각자의 진행상황을 표시하는 메인 화면

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Image, Button} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import UserProcessList from '../components/UserProcessList';



const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const Layout=styled.View` 
    background-color: ${({theme})=>theme.background};
    align-items: center;
    flex-direction: row;
`;

const Header=styled.View` 
    width: ${({width})=>width}px;
    height: 80px;
    background-color: ${({theme})=>theme.background};    
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    padding: 0;
`;

const Process=styled.View`
    min-height: 120px;
    flex-direction: row;
`;

const ProcessBook=styled.View`
    flex: 30%;
    background-color: ${({theme})=>theme.appBackground};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0 10px 0;
    borderRight-color: ${({theme})=>theme.background};
    borderRight-width: 3px;
`;

const ProcessText=styled.View`
    flex: 70%;
    background-color: ${({theme})=>theme.appBackground};
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 10px 0px 10px 0;
`;

const ProcessCon=styled.View`
    background-color: ${({theme})=>theme.background};
    width: ${({width})=>(width)*0.65}px;
    margin: 5px 0 5px 10px;
    border-radius: 5px;
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
      fontSize: 14,
      color: theme.text,
      padding: 0,
      marginLeft: 10,
      marginVertical: 7, 
      backgroundColor: theme.background,
    },
    bookimg: {
        width: 90,
        height: 120,
    },
  });

const MainHeader= ({clubname, movetoInfo1, movetoInfo2})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
         <Button                    //개인이 개인의 진행 상황(게이지 바)를 수정하는 화면으로 이동
            title="목표 수정"
            onPress={movetoInfo1} 
            color= '#fac8af'
        />
        <Text style={styles.clubname}>{clubname}</Text>
        <Button
            title="진행 수정"
            onPress={movetoInfo2}       //클럽 모임장에게만 드러나는 버튼->목표 책 제목/페이지를 수정하는 화면으로 이동
            color= '#fac8af'            //드러나지 않게 하는 방법은 color를 '#ffffff'로 수정하면 될 것이라고 생각합니다. (MyClubMainInfo_2의 헤더 참조)
        />
        </Header>
    )
};

const MainProcess=({booktitle, goalpage, page})=>{
    const width = Dimensions.get('window').width;

    return(
        <Process>
        <ProcessBook>
            <Image
                style={styles.bookimg}
                source={{
                uri: 'http://drive.google.com/uc?export=view&id=1hOSJNzP8gFXMqfeu-7Suo4mTgiQcLrIp',
                }}
            />
        </ProcessBook>
        <ProcessText>
            <ProcessCon width={width}>
            <Text style={styles.processText}>제목: {booktitle}</Text>
            </ProcessCon>
            <ProcessCon width={width}>
            <Text style={styles.processText}>목표 페이지: {goalpage}P</Text>
            </ProcessCon>
            <ProcessCon width={width}>
            <Text style={styles.processText}>진행중인 페이지: {page}P</Text>
            </ProcessCon>
        </ProcessText>
    </Process>
    )
}


const tempData = {
    "clubname": "SEORAP",
    "booktitle": "보노보노, 오늘 하루는 어땠어?",
    "goal": 226,
    "userlist": [
      {
        "id": 1,
        "user_name": "멤버A",
        "img_url": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
        "user_rate": 1,
      },
      {
        "id": 2,
        "user_name": "멤버B",
        "img_url": "http://drive.google.com/uc?export=view&id=1psgmqUpSA_Mgrxw-5RY2cMSpDI_TKmuM",
        "user_rate": 0.3,

      },
      {
        "id": 3,
        "user_name": "멤버C",
        "img_url": "http://drive.google.com/uc?export=view&id=1Z-kttQHMB-kMHQ_3cyKqroT3paw_PJ1k",
        "user_rate": 0.5,
       
      },
      {
        "id": 4,
        "user_name": "멤버D",
        "img_url": "http://drive.google.com/uc?export=view&id=1n1zQxO4FfO_Q4LUYcWR6tuXoI8UepvDJ",
        "user_rate": 0.7,
        
      },
      {
        "id": 5,
        "user_name": "멤버E",
        "img_url": "http://drive.google.com/uc?export=view&id=1877gatJkVEbpzp9TL897--_Fj1oYrOZ2",
        "user_rate": 0.1,
       
      },
      {
        "id": 6,
        "user_name": "멤버F",
        "img_url": "http://drive.google.com/uc?export=view&id=1VDKn12Lw17MQ4tEmL8kMhDtL7kqTjwkS",
        "user_rate": 0.45,
       
      },
      {
        "id": 7,
        "user_name": "멤버G",
        "img_url": "http://drive.google.com/uc?export=view&id=1_TNsKJatqW3PYWwByqDW_RDQ2qvMfrhY",
        "user_rate": 0.1,
       
      },
      {
        "id": 8,
        "user_name": "멤버H",
        "img_url": "http://drive.google.com/uc?export=view&id=1nuoptwRc_kqQdm_xqPzPkaPK-tG0u_08",
        "user_rate": 0.1,
       
      },
      
    ]
}



const MyClubMainInfo=({ navigation })=>{

    const width= Dimensions.get('window').width;

    const movetoInfo2=()=>{
        navigation.navigate("MyClubMainInfo_2")
    }

    const movetoInfo1=()=>{
        navigation.navigate("MyClubMainInfo_1")
    }


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
            headerLeft: ({onPress, tintColor})=>{
                return(
                    <Layout>
                    <MaterialCommunityIcons
                        name="keyboard-backspace"
                        size={30}
                        style={{marginLeft:13}}
                        color={tintColor}
                        onPress={onPress}   //뒤로가기
                    />
                    <MaterialCommunityIcons
                        name="alert-circle"
                        size={30}
                        style={{marginLeft:10}}
                        color={tintColor}
                        onPress={()=>navigation.navigate("MyClubMainManage")}   //클럽 정보를 관리하는 MyClubMainManage로 이동
                    />
                    </Layout>
                );
            },
            headerRight: ({onPress, tintColor})=>{
                return(
                    <Layout>
                    <MaterialCommunityIcons
                        name="format-list-bulleted"
                        size={30}
                        style={{marginRight:10}}
                        color={tintColor}
                        onPress={onPress}   //수정필요-진행완료된 책 화면으로 이동

                    />
                    <MaterialCommunityIcons
                        name="magnify"
                        size={30}
                        style={{marginRight:10}}
                        color={tintColor}
                        onPress={onPress}   //수정필요-책 추천화면 이동
                    />
                    </Layout>
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
            <MainHeader clubname={tempData.clubname} movetoInfo1={movetoInfo1} movetoInfo2={movetoInfo2}></MainHeader>
          
            <MainProcess
                booktitle={tempData.booktitle}
                goalpage={tempData.goal}
                page={226}
            ></MainProcess>

            <List width={width}>
            <UserProcessList userInfo={tempData}></UserProcessList>
            </List>
            
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubMainInfo;