//MyClubScheduleListT.js 에서 사용하는 스케줄 목록 컴포넌트 

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import {MaterialCommunityIcons} from '@expo/vector-icons';


const Container = styled.View`
  width: ${({ width }) => width}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const ContainerRow=styled.View`
width: ${({ width }) => width}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const Date = styled.View`
  width: ${({ width }) => (width)*0.2}px;  
  min-height: 90px;
  justify-content: center;
  align-items: center;
  borderRight-Width: 0.8px;
  borderRight-Color: ${({ theme }) => theme.seperator};
`;

const ExtInfo = styled.View`
    width: ${({ width }) => (width)*0.65}px;
    min-height: 70px;
    marginTop: 10px;
    marginBottom: 10px;
    flex-direction: column;
`;

const Icon=styled.View`
  width: ${({ width }) => (width)*0.15}px;  
  min-height: 90px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  borderLeft-Width: 0.8px;
  borderLeft-Color: ${({ theme }) => theme.seperator};
`;


//scheduleInfo는 렌더링할 아이템(tempData), selectedYear과 selectedMonth는 각각 picker로 선택된 연도와 월입니다.
//선택된 연도와 월을 이용해 db에서 특정 schedule만 select하여 가져오는 방법 쪽을 구상하고 만들었습니다.
const ScheduleList = ({scheduleInfo, selectedYear, selectedMonth}) => {    
    const width = Dimensions.get('window').width;
    const user = scheduleInfo.schedule;

    const renderItem = ({ item }) => {
        return (
            <ContainerRow width={width}>
            <Date width={width}>
                <Text style={styles.date}>{item.date}일</Text>
            </Date>
            <ExtInfo width={width}>
                <Text style={styles.text}>시간: {item.time}</Text>  
                <Text style={styles.text}>장소: {item.place}</Text>  
                <Text style={styles.text}>메모: {item.memo}</Text>  
            </ExtInfo>
            <Icon width={width}>
            <MaterialCommunityIcons
                name="pencil"
                size={25}
                style={{marginBottom: 10}}
                color='#000000'
                onPress={()=>{}}        //일정 수정 view로 이동하는 함수 필요
            />
            <MaterialCommunityIcons
                name="delete"
                size={25}
                style={{marginTop:10}}
                color='#000000'
                onPress={()=>{}}       //일정 삭제 함수 필요(데이터베이스에서 삭제)
            />        
            </Icon>
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
    backgroundColor: theme.seperator,
  }
});

ScheduleList.propTypes = {
  scheduleInfo: PropTypes.object.isRequired,
};

export default ScheduleList;