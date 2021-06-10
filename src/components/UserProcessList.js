//클럽의 메인 페이지(진행상황)에서 사용하는 클럽의 목표 책에 대한 멤버들의 진행상황을 표시하는 리스트 컴포넌트
//각 멤버가 입력한 자신의 진행 페이지를 숫자로 받아오면 '목표 페이지에 대한 진행 페이지'를 퍼센트 표기로 바꾸어 게이지 형식으로 구현
//멤버의 프로필이미지/닉네임/진행게이지/진행퍼센트표기 가 출력됩니다.

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList, Image } from 'react-native';
import { theme } from '../theme';



const Container = styled.View`
  width: ${({ width }) => width}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const Fix=styled.View`
    width: 80px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.inputBackground};
`;
const UserProgress = styled.View`
  width: ${({ width }) => width}px;  
  height: 70px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const ProgressBar=styled.View`
    width: ${({ rate }) => (rate)}px;
    height: 30px;
    background-color: ${({ theme }) => theme.appBackground};
    border-radius: 10px;
    border-color: ${({ theme }) => theme.text};
    border-width: 1px;

`;


const UserProcessList = ({userInfo}) => {
    const width = Dimensions.get('window').width;
    const user = userInfo.userlist;

    const renderItem = ({ item, onPress }) => {
        return (
            <UserProgress width={width}>
                <Image 
                    style={styles.profileimg}
                    source={{uri:item.img_url}} />
                <Fix><Text style={styles.username}>{item.user_name}</Text></Fix>
                <ProgressBar rate={((width)*0.52)*(item.user_rate.toString())} />
                <Text style={styles.userrate}>{100*(item.user_rate)}%</Text>
            </UserProgress>
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
  username: {
    fontSize: 16,
    color: theme.text,
  },
  profileimg: {
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  userrate: {
    fontSize: 16,
    color: theme.text,
    paddingLeft: 7,
  },
  separator: {
    height: 1,
    backgroundColor: theme.seperator,
  }
});

UserProcessList.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default UserProcessList;