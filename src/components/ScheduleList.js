//일정 조회 화면에서 사용되는 일정 리스트 컴포넌트
//picker을 통해 연/월을 선택, 해당하는 일정들을 골라 시간순 출력합니다.
//출력 대상 - 날짜/이름/시간/장소/메모
//일정의 제거 가능

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { theme } from '../theme';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { DB} from '../utils/firebase';


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



const ScheduleList = ({navigation, scheduleInfo, selectedYear, selectedMonth, onUpdate}) => {
    const width = Dimensions.get('window').width;
    const user = scheduleInfo.schedule;

    const renderItem = ({ item }) => {
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
                  onPress={_handleDeleteButtonPressed}      
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
