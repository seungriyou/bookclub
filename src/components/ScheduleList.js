//MyClubScheduleListT.js 에서 사용하는 스케줄 목록 컴포넌트

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { theme } from '../theme';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { DB, Storage, getCurrentUser} from '../utils/firebase';


const Container = styled.View`
  width: ${({ width }) => width}px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const ContainerRow=styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const Date = styled.View`
  width: ${({ width }) => (width)*0.2}px;
  justify-content: space-between;
  align-items: center;
  borderRight-Width: 0.8px;
  borderRight-Color: ${({ theme }) => theme.separator};
`;

const ExtInfo = styled.View`
    width: ${({ width }) => (width)*0.8}px;
    min-height: 70px;
    marginTop: 10px;
    marginBottom: 10px;
    flex-direction: column;
`;

const Icon=styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


//scheduleInfo는 렌더링할 아이템(tempData), selectedYear과 selectedMonth는 각각 picker로 선택된 연도와 월입니다.
//선택된 연도와 월을 이용해 db에서 특정 schedule만 select하여 가져오는 방법 쪽을 구상하고 만들었습니다.
const ScheduleList = ({navigation, scheduleInfo, selectedYear, selectedMonth, onUpdate}) => {
    const width = Dimensions.get('window').width;
    const user = scheduleInfo.schedule;

    const renderItem = ({ item }) => {
        const _handleEditButtonPressed = () => {
          navigation.navigate('MyClubScheduleNav', {screen: 'MyClubScheduleEdit', params: item});
        }

        const _handleDeleteButtonPressed = () => {
          Alert.alert("경고", "일정을 삭제하시겠습니까?",
          [
            {
              text: "아니요",
              style: "cancel"
            },
            {
              text: "예",
              onPress: async () => {
                try {
                  const scheduleRef = await DB.collection('clubs').doc(item.clubId).collection('schedule').doc(item.id).delete();
                  onUpdate();
                  Alert.alert("일정 삭제 완료");
                }
                catch(e) {
                  Alert.alert("일정 삭제 오류", e.message);
                }
              }
            }
          ]);
        }
        return (
            <ContainerRow width={width}>
            <Date width={width}>
              <MaterialCommunityIcons
                  name="delete"
                  size={25}
                  style={{marginTop:10, marginBottom: 20}}
                  color='#ffffff'
                />
              <Text style={styles.date}>{item.date}일</Text>
              <MaterialCommunityIcons
                  name="delete"
                  size={25}
                  style={{marginBottom:10, marginTop: 20}}
                  color='#000000'
                  onPress={_handleDeleteButtonPressed}       //일정 삭제 함수 필요(데이터베이스에서 삭제)
              />
            </Date>
            <ExtInfo width={width}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>시간: {item.time}</Text>
                <Text style={styles.text}>장소: {item.place}</Text>
                <Text style={styles.text}>메모: {item.memo}</Text>
            </ExtInfo>

            </ContainerRow>
        );

    };
    return (
        <Container width={width}>
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={user}
            renderItem={renderItem}
            ItemSeparatorComponent={() => {
            return (
                <View style={styles.separator} />
            );
            }}
        />
        </Container>
    );
};

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
    color: theme.text,
    fontWeight: "bold",
  },
  title:{
    fontSize: 16,
    color: theme.text,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:2,
    paddingBottom:10,
    fontWeight: "bold",
  },
  text:{
    fontSize: 16,
    color: theme.text,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:2,
    paddingBottom:2,
  },
  separator: {
    height: 1,
    backgroundColor: theme.separator,
  }
});

ScheduleList.propTypes = {
  scheduleInfo: PropTypes.object.isRequired,
};

export default ScheduleList;
//
// <MaterialCommunityIcons
//     name="pencil"
//     size={25}
//     style={{marginBottom: 10}}
//     color='#000000'
//     onPress={_handleEditButtonPressed}        //일정 수정 view로 이동하는 함수 필요
// />
