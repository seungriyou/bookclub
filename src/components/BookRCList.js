//책 둘러보기 화면에서 사용되는 리스트 컴포넌트
//검색결과를 받아온 후 api가 연결되면 결과값을 출력한다 - 책 제목/저자/별점/이미지

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, Image, FlatList} from 'react-native';
import { theme } from '../theme';


const Container = styled.View`
  width: ${({ width }) => width}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
  paddingBottom: 40px;
`;

const ContainerRow=styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const Cover = styled.View`
  width: ${({ width }) => (width)*0.25}px;
  min-height: 120px;
  justify-content: center;
  align-items: center;
  borderRight-Width: 0.8px;
  borderRight-Color: ${({ theme }) => theme.separator};
`;

const ExtInfo = styled.View`
    width: ${({ width }) => (width)*0.75}px;
    min-height: 70px;
    marginTop: 15px;
    marginBottom: 15px;
    flex-direction: column;
`;



const BookRCList = ({bookInfo, clubid}) => {
    const width = Dimensions.get('window').width;
    const book = bookInfo;
    const id = clubid;

    const renderItem = ({ item }) => {
    return (
        <ContainerRow width={width}>
        <Cover width={width}>
            <Image
                style={styles.image}
                source={{uri:item.image}} />

        </Cover>

        <ExtInfo width={width}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author} 저</Text>
            <Text style={styles.rating}>별점: {item.rating}</Text>
        </ExtInfo>
        </ContainerRow>
    );       

    };
    return (
        <Container width={width}>
        <FlatList
            data={book}
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
  title: {
    fontSize: 16,
    color: theme.text,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:2,
    paddingBottom:2,
    fontWeight: "bold",
  },
  author:{
    fontSize: 12,
    color: theme.text,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:2,
    paddingBottom:6,
  },
  rating:{
    fontSize: 14,
    color: theme.text,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:2,
    paddingBottom:2,
  },
  image:{
    width: 60,
    height: 90,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop:2,
    paddingBottom:2,
  },
  separator: {
    height: 1,
    backgroundColor: theme.separator,
  }
});

BookRCList.propTypes = {
  bookInfo: PropTypes.object.isRequired,
};

export default BookRCList;
