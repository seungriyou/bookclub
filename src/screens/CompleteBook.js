//클럽이 완료한 책 목록을 조회하는 완료한 도서 목록 화면
//picker을 통해 연/월을 지정, 날짜별로 클럽이 완료한 책이 등록됩니다.
//기존 도서 등록 시 사용되었던 알라딘 api가 그대로 연결되어 data가 출력됩니다.


import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import {Picker} from '@react-native-picker/picker';
import CompleteBookList from '../components/CompleteBookList';
import { DB } from '../utils/firebase';
import moment from 'moment';


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

const CompleteBook=({ navigation, route })=>{

    const id = route.params.id;

    const width= Dimensions.get('window').width;
    const [selectedMonth, setSelectedMonth] = useState(moment(Date.now()).format('MM'));
    const [selectedYear, setSelectedYear] = useState(moment(Date.now()).format('YYYY'));
    const [bookList, setBookList] = useState({
        complete: [],
      });
    const [clubName, setClubName] = useState("");

    const getCompleteBook = async() => {
      try{
        const clubRef = DB.collection('clubs').doc(id);
        const clubDoc = await clubRef.get();
        const clubData = clubDoc.data();
        const bookList = clubData.book_completed;
        const tempBookList = [];

        setClubName(clubData.title);

        let index = 1;

        bookList.sort(function(a, b) {
          return parseInt(a.completedate) - parseInt(b.completedate);
        });

        for(let book of bookList) {
          if(book.completeyear == selectedYear && book.completemonth == selectedMonth) {
            book.itemId = index;

            for(let member of book.members) {
              member.id = index;
            }
            index = index + 1;
            tempBookList.push(book);
          }
        }

        setBookList({
          complete: tempBookList
        });
      }
      catch(e) {
        Alert.alert("클럽 도서 목록 수신 오류", e.message);
      }

    }

    useEffect(() => {
      getCompleteBook();
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
      console.log(bookList);
    }, [bookList]);

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
        getCompleteBook();
    }, []);


    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader clubname={clubName}></MainHeader>
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
                    style={{ height: 50, width: 110, margin: 10 }}
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
            <CompleteBookList completebookInfo={bookList} />
        </List>
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default CompleteBook;
