//모임장이 책 등록 이전 책 검색을 할 때 사용되는 검색 결과 리스트 출력 컴포넌트
//input에 대한 결과로 책 이미지/제목/저자/내용을 출력하며, 선택 버튼을 통해 책 등록이 가능
//등록된 책은 클럽의 메인 페이지(진행상황)에서 클럽 멤버 모두가 확인 가능

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, Button, Image, FlatList, Alert } from 'react-native';
import { theme } from '../theme';
import { DB } from '../utils/firebase';


const Container = styled.View`
  width: ${({ width }) => width}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
  padding-Bottom: 40px;
`;

const ContainerRow=styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const Cover = styled.View`
  width: ${({ width }) => (width)*0.25}px;
  min-height: 200px;
  justify-content: center;
  align-items: center;
  borderRight-Width: 0.8px;
  borderRight-Color: ${({ theme }) => theme.separator};
  paddingTop: 15px;
  paddingBottom: 15px;
`;

const ExtInfo = styled.View`
    width: ${({ width }) => (width)*0.75}px;
    min-height: 70px;
    marginTop: 15px;
    marginBottom: 15px;
    flex-direction: column;
`;

const Box=styled.View`
  min-width: 10px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;


const BookSearchList = ({bookInfo, clubid}) => {
    const width = Dimensions.get('window').width;
    const book = bookInfo;
    const id = clubid;

    const renderItem = ({ item }) => {
        const _handleSelectButtonPressed = () => {
          Alert.alert("알림", `${item.title} 이 책을 선택하시겠습니까?`,
          [
            {
              text: "아니요",
              style: "cancel"
            },
            {
              text: "예",
              onPress: async () => {
                try {
                  const clubRef = DB.collection('clubs').doc(item.clubId);
                  const clubDoc = await clubRef.get();
                  const clubData = clubDoc.data();
                  console.log(clubData);

                  if (clubData.book_now.title === "" && clubData.book_now.cover === "") {
                    await DB.runTransaction(async (t) => {
                      const bookNow = {
                        title: item.title,
                        cover: item.cover,
                        author: item.author,
                        description: item.description,
                        goal: 0,
                      }

                      t.update(clubRef, {book_now: bookNow});
                    });
                    Alert.alert("알림", `${item.title} 이 책을 등록하였습니다`);
                  }
                  else{
                    Alert.alert("경고", "현재 진행중인 책이 있습니다.");
                  }
                }
                catch(e) {
                  Alert.alert("글 삭제 오류", e.message);
                }
              }
            }
          ]);
        }

        return (
            <ContainerRow width={width}>
            <Cover width={width}>
                <Button
                    title="선택"
                    onPress={_handleSelectButtonPressed}
                    color= '#fac8af'
                />
                <Box />
                <Image
                    style={styles.img}
                    source={{uri:item.cover}} />

            </Cover>

            <ExtInfo width={width}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </ExtInfo>


            </ContainerRow>
        );

    };
    return (
        <Container width={width}>
        <FlatList
            keyExtractor={(item) => item.itemId.toString()}
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
  description:{
    fontSize: 14,
    color: theme.text,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:2,
    paddingBottom:2,
  },
  img:{
    width: 75,
    height: 120,
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

BookSearchList.propTypes = {
  bookInfo: PropTypes.object.isRequired,
};

export default BookSearchList;
