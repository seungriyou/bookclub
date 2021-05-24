//스크린 페이지-책 완료 화면 입니다.
//picker을 통해 연/월을 지정, 날짜별로 클럽이 완료한 책이 등록합니다.
//알라딘api에서 필요 정보는 책 커버/책 제목/책 저자/책 소개글 입니다.

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import {Picker} from '@react-native-picker/picker';
import CompleteBookList from '../components/CompleteBookList';




const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const ContainerRow=styled.View`
    width: ${({width})=>width}px;
    flex-direction: row;
    justify-content: center;
    borderBottom-color: ${({theme})=>theme.separator};
    borderBottom-width: 1px;
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

const MainHeader= ({clubname})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
         
        <Text style={styles.clubname}>{clubname}</Text>
        
        </Header>
    )
};



const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;



const styles = StyleSheet.create({
  First: {
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  Second:{
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  Img: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  clubname: {
    fontSize: 25,
    color: theme.text,
  },
});




const tempData = {
    "clubname": "SEORAP",
    "complete": [
        {
            "itemId": 1,
            "completemonth": "May",
            "completedate": 1,
            "title": "책 제목이 제법 길 경우를 상정 및 고려하여 작성된 테스트용 긴 제목",
            "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
            "author": "나츠메 소세키",
            "description": "이 부분은 소개글입니다. 아래 버튼을 눌러 해당 책을 완료한 멤버들의 정보를 불러올 수 있습니다. CompleteUserForm.js, CompleteUserList.js 컴포넌트를 참조해주세요.",
        },
        {
            "itemId": 2,
            "completemonth": "May",
            "completedate": 5,
            "title": "잠들지 않는 새벽",
            "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
            "author": "달그림자",
            "description": "picker을 사용하여 schedulelist 화면과 동일하게 작동함을 예상합니다. 스크롤이 동작합니다.",
        },
        {
            "itemId": 3,
            "completemonth": "May",
            "completedate": 11,
            "title": "가장 차가운 것",
            "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
            "author": "벽난로",
            "description": "현재 flatlist를 표시하는 컴포넌트는 CompleteBookList.js 입니다.",
        },
        {
            "itemId": 4,
            "completemonth": "May",
            "completedate": 21,
            "title": "탈수",
            "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
            "author": "에비앙",
            "description": "실제 책은 이 정도 길이의 소개글이 자리합니다. 코로나19가 정말 걸리면 큰일이 나는 위험한 것인가? 코로나19와 가장 밀접한 곳에서 일하고 있는 응급의학과 의사인 저자의 경험담과 생각은, 우리가 코로나19에 대해 아무렇지도 않게 무심코 받아들인 정보들과 상황들이 과연 모두 맞는 건지 의구심을 가지게 한다.",
        },
        {
            "itemId": 5,
            "completemonth": "May",
            "completedate": 23,
            "title": "라일락",
            "cover": "http://drive.google.com/uc?export=view&id=1lpkydEo7ARg5hSUF400140g8ePrUR3O4",
            "author": "무지개",
            "description": "라벤더와 착각하고 있지는 않으신가요?",
        },
    ]        
}


const CompleteBook=({ navigation })=>{

    const width= Dimensions.get('window').width;
    const [selectedMonth, setSelectedMonth] = useState("05");  
    const [selectedYear, setSelectedYear] = useState("2021");

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
                        onPress={onPress}  
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
            <MainHeader clubname={tempData.clubname}></MainHeader>
            <ContainerRow width={width}>
                <Picker
                    selectedValue={selectedYear}
                    style={{ height: 50, width: 110, margin: 10 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}>
                    <Picker.Item label="2021" value="2021" />
                    <Picker.Item label="2022" value="2022" />
                    <Picker.Item label="2023" value="2023" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                </Picker>
                <Picker
                    selectedValue={selectedMonth}
                    style={{ height: 50, width: 100, margin: 10 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}>
                    <Picker.Item label="Jan." value="01" />
                    <Picker.Item label="Feb." value="02" />
                    <Picker.Item label="Mar." value="03" />
                    <Picker.Item label="Apr." value="04" />
                    <Picker.Item label="May." value="05" />
                    <Picker.Item label="Jun." value="06" />
                    <Picker.Item label="Jul." value="07" />
                    <Picker.Item label="Aug." value="08" />
                    <Picker.Item label="Sept." value="09" />
                    <Picker.Item label="Oct." value="10" />
                    <Picker.Item label="Nov." value="11" />
                    <Picker.Item label="Dec." value="12" />
                </Picker>
          </ContainerRow>
        <List width={width}>
            <CompleteBookList completebookInfo={tempData} />
        </List>
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default CompleteBook;