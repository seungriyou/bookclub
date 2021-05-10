//개인이 개인의 진행중인 페이지를 수정하는 화면
//조작 부분 외 다른 부분의 클릭을 막는 방법 필요 

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Image, Button, TextInput} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import UserProcessList from '../components/UserProcessList';



const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.text};
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
    input: {
        height: 40,
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: theme.appBackground,
        borderRadius: 10,
      },
  });


const MainHeader= ({clubname, onPress})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
        <MaterialCommunityIcons         //비율 맞추기 용도 (배경과 같은 색 설정, 사용X)
            name="keyboard-backspace"
            size={30}
            style={{marginLeft:13}}
            color='#ffffff'
        />
        <Text style={styles.clubname}>{clubname}</Text>
        <Button
            title="완료"
            onPress={onPress} 
            color= '#fac8af'
        />
        </Header>
    )
};

const MainProcess=({booktitle, goalpage, page, _handlepageChange})=>{
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
            <TextInput
                style={styles.input}
                placeholder="페이지를 입력하세요"
                onChangeText={_handlepageChange}
                value={page}
            />
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



const MyClubMainInfo_2=({ navigation })=>{

    const width= Dimensions.get('window').width;

    const [page, setpage] = useState('');

    const _handlepageChange = text => {
        setpage(text);
    } 

    const _alertfinish=()=>{
        alert('수정을 완료했습니다.')
        navigation.navigate('MyClubMainInfo')   //값 변경 이후에는 원래의 Info화면으로 돌아올 것 
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
                        onPress={()=>{}}   //고민
                    />
                    </Layout>
                );
            },
            headerRight: ({tintColor})=>{
                return(
                    <Layout>
                    <MaterialCommunityIcons
                        name="format-list-bulleted"
                        size={30}
                        style={{marginRight:10}}
                        color={tintColor}
                        onPress={()=>{}}   //고민

                    />
                    <MaterialCommunityIcons
                        name="magnify"
                        size={30}
                        style={{marginRight:10}}
                        color={tintColor}
                        onPress={()=>{}}   //고민
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
            <MainHeader 
                clubname={tempData.clubname}
                onPress={_alertfinish}
            ></MainHeader>
          
            <MainProcess
                booktitle={tempData.booktitle}
                goalpage={tempData.goal}
                page={page}
                _handlepageChange={_handlepageChange}
            ></MainProcess>

            <List width={width}>
            <UserProcessList userInfo={tempData}></UserProcessList>
            </List>
            
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubMainInfo_2;