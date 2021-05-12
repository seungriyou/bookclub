//클럽의 일정 목록을 확인하는 화면
//git에서 MyClubScheduleList.js 화면과 일치하는 용도이나, 임시적인 구별을 위해 스크린의 이름을 다르게 해 두었습니다.

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import {Picker} from '@react-native-picker/picker';
import ScheduleList from '../components/ScheduleList';

const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const ContainerRow=styled.View`
    width: ${({width})=>width}px;
    height: 60px;
    flex-direction: row;
    background-color: ${({theme})=>theme.background};
    align-items: center;
    justify-content: center;
    borderBottom-Width: 1px;
    borderBottom-Color: ${({theme})=>theme.seperator};
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const Header=styled.View` 
    width: ${({width})=>width}px;
    height: 80px;
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

const styles = StyleSheet.create({
    clubname: {
      fontSize: 25,
      color: theme.text,
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


//더미데이터에서는 일정에 대한 구분을 월/일 로 해두었습니다. 
//picker을 통해 연도를 설정할 수 있기 때문에 실제로는 연/월/일로 구분하는게 옳다고 생각하나,
//firebase db에 미숙하기 때문에 확언이 어렵습니다... 사용이 용이한 쪽으로 변형해주시면 될 것 같습니다.
const tempData = {
    "clubname": "SEORAP",
    "booktitle": "보노보노, 오늘 하루는 어땠어?",
    "goal": 226,
    "schedule":[
        {
            "id": 1,
            "month": "Apr",
            "date": 2,
            "time": "8:00",
            "place": "zoom",
            "memo": "필참입니다. 너무 늦지 않도록 해주세요.",
        },
        {
            "id": 2,
            "month": "May",
            "date": 12,
            "time": "8:30",
            "place": "zoom",
            "memo": "",
        },
        {
            "id": 3,
            "month": "May",
            "date": 14,
            "time": "9:00",
            "place": "zoom",
            "memo": "특이사항 추후 수정 예정입니다. 시간이 변동될 수 있으니 주의해주세요.",
        },
        {
            "id": 4,
            "month": "May",
            "date": 19,
            "time": "17:00",
            "place": "zoom",
            "memo": "독서록 준비",
        },
        {
            "id": 5,
            "month": "May",
            "date": 20,
            "time": "23:30",
            "place": "zoom",
            "memo": "",
        },
        {
            "id": 6,
            "month": "May",
            "date": 24,
            "time": "10:00",
            "place": "zoom",
            "memo": "",
        },
        {
            "id": 7,
            "month": "May",
            "date": 30,
            "time": "8:00",
            "place": "zoom",
            "memo": "특이사항 추후 수정 예정입니다.",
        },
    ]
}



const MyClubScheduleListT=({ navigation })=>{

    const width= Dimensions.get('window').width;
    const [selectedMonth, setSelectedMonth] = useState("May");  //이부분을 현재 app을 가동한 시간의 date를 통해 월 값을 가져올 수 있을지....? 
    const [selectedYear, setSelectedYear] = useState("2021");  //이부분을 현재 app을 가동한 시간의 year을 통해 월 값을 가져올 수 있을지....? 

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
                        onPress={onPress}   //뒤로가기
                    />
                );
            },
            headerRight: ({tintColor})=>{
                return(
                    
                    <MaterialCommunityIcons
                        name="pencil"
                        size={30}
                        style={{marginRight:13}}
                        color={tintColor}
                        onPress={()=>{}}   //수정 필요 -> ScheduleCreation화면으로 이동
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
                <Picker.Item label="Jan." value="Jan" />
                <Picker.Item label="Feb." value="Feb" />
                <Picker.Item label="Mar." value="Mar" />
                <Picker.Item label="Apr." value="Apr" />
                <Picker.Item label="May." value="May" />
                <Picker.Item label="Jun." value="Jun" />
                <Picker.Item label="Jul." value="Jul" />
                <Picker.Item label="Aug." value="Au" />
                <Picker.Item label="Sept." value="Sept" />
                <Picker.Item label="Oct." value="Oct" />
                <Picker.Item label="Nov." value="Nov" />
                <Picker.Item label="Dec." value="Dec" />
            </Picker>
            
            </ContainerRow>
            <List width={width}>
            <ScheduleList scheduleInfo={tempData} selectedYear={selectedYear} selectedMonth={selectedMonth}></ScheduleList>
            </List>
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubScheduleListT;