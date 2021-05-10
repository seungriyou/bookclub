import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList, Image } from 'react-native';
import { theme } from '../theme';
import {MaterialCommunityIcons} from '@expo/vector-icons';


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