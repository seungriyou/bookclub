//책 완료 화면 내부 -> 완료된 책 정보 리스트 내부 -> 버튼 내부 에 존재하는 해당 책을 완료한 사람들의 리스트 컴포넌트


import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Dimensions, Text, StyleSheet, FlatList, Image } from 'react-native';
import { theme } from '../theme';



const Container = styled.View`
  margin: 0px 10px 0px 10px;
  paddingLeft: 5px;
  borderLeft-width: 0.9px;
  borderLeft-Color: ${({ theme }) => theme.separator};
`;

const ContainerRow=styled.View`
  max-width: ${({ width }) => ((width)*0.5)}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  paddingTop: 3px;
  paddingBottom: 7px;
  paddingLeft: 5px;
`;



const CompleteUserList = ({completeuserInfo}) => {
    const width = Dimensions.get('window').width;

    const user = completeuserInfo.member;

    const renderItem = ({ item }) => {
        return (
          <ContainerRow width={width}>
                <Image 
                    style={styles.profileimg}
                    source={{uri:item.profileimg}} />
                <Text style={styles.name}>{item.name}</Text>
          </ContainerRow>
        );
    };
    return (
        <Container width={width}>
        <Text style={styles.text}>책 읽기를 완료한 멤버</Text>
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={user}
            renderItem={renderItem}
        />
        </Container>
    );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: theme.text,
    paddingLeft: 8,
    paddingTop: 3,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
    color: theme.text,
    paddingLeft: 10,
  },
  profileimg: {
    marginLeft: 0,
    width: 25,
    height: 25,
    borderRadius: 50,
  },
  separator: {
    height: 1,
    backgroundColor: theme.separator,
  },
});

CompleteUserList.propTypes = {
  completeuserInfo: PropTypes.object.isRequired,
};

export default CompleteUserList;