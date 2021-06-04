import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import {Picker} from '@react-native-picker/picker';
import ScheduleList from '../components/ScheduleList';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import moment from 'moment';


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
    borderBottom-Color: ${({theme})=>theme.separator};
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

const Box=styled.View`
  width: 10px;
  height: 20px;
`;

const styles = StyleSheet.create({
    clubname: {
      fontSize: 25,
      color: theme.text,
    },
    alim: {
      fontSize: 18,
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

const MyClubScheduleList=({ navigation, route })=>{
    const id = route.params?.id;
    const clubname = route.params.clubname;
    const width= Dimensions.get('window').width;
    const today_date = moment(Date.now()).format('MM');
    const today_year = moment(Date.now()).format('YYYY');
    const [update, setUpdate] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(today_date);
    const [selectedYear, setSelectedYear] = useState(today_year);
    const [schedule, setSchedule] = useState([]);
    const [filtered, setFiltered] = useState({
      clubname: "",
      schedule: []
    });

    const getSchedule = async() => {
      try{
        const scheduleRef = DB.collection('clubs').doc(id).collection('schedule');
        const scheduleDoc = await scheduleRef.orderBy('date').get();
        const list = [];
        scheduleDoc.forEach(doc => {
          const data = doc.data();
          const now = moment().startOf('day');
          console.log(data);
          const tempschedule = {
            id: data.id,
            clubId: id,
            year: moment(data.date.toDate()).format('YYYY'),
            month: moment(data.date.toDate()).format('MM'),
            date: moment(data.date.toDate()).format('DD'),
            time: moment(data.date.toDate()).format('hh:mm'),
            place: data.site,
            title: data.title,
            memo: data.memo,
          }
          //console.log(moment(data.date.toDate()).format('YYYY MM DD HH:mm'));
          list.push(tempschedule);
        })
        setSchedule(list);
      }
      catch(e) {
        Alert.alert("스케쥴 수신 에러", e.message);
      }
    };

    const onUpdate = () => {
      setUpdate(update + 1);
    }

    const filterSchedule = async() => {
      const temp = {
        clubname: route.params.title,
        schedule: [],
      };
      for (let sch of schedule) {
        if (sch.year == selectedYear && sch.month == selectedMonth) {
          temp.schedule.push(sch);
          console.log(sch);
        }
      };
      setFiltered(temp);
    }

    useEffect(()=> {
      getSchedule();
    }, []);

    useEffect(()=> {
      getSchedule();
    }, [update]);

    useEffect(() => {
      filterSchedule();
    }, [schedule, selectedYear, selectedMonth]);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getSchedule();
      });
      return unsubscribe;
    }, [navigation]);

    return (
      <KeyboardAwareScrollView
          contentContainerStyle={{flex: 1}}
          extraScrollHeight={20}
      >
      <Container>
          <MainHeader clubname={filtered.clubname}></MainHeader>
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

          {filtered.schedule.length > 0 ? (
            <List width={width}>
              <ScheduleList scheduleInfo={filtered} selectedYear={selectedYear} selectedMonth={selectedMonth} onUpdate={onUpdate}></ScheduleList>
            </List>
            )
            : (
            <Container>
              <Box/>
              <Text style={styles.alim}>이번달 일정이 없습니다!</Text>
            </Container>
          )}

      </Container>
      </KeyboardAwareScrollView>
    );

  };


export default MyClubScheduleList;
