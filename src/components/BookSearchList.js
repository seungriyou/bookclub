import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, Button, Image, FlatList, Alert } from 'react-native';
import { theme } from '../theme';
import { DB, Storage, getCurrentUser} from '../utils/firebase';


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



const BookSearchList = ({navigation, bookInfo}) => {
    const width = Dimensions.get('window').width;
    const user = bookInfo;

    const renderItem = ({ item }) => {
        const _handleSelectButtonPressed = () => {
          alert('이 책을 목표로!')
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
                <Text style={styles.author}>{item.author} 저</Text>
                <Text style={styles.description}>{item.description}</Text>
            </ExtInfo>

            
            </ContainerRow>
        );

    };
    return (
        <Container width={width}>
        <FlatList
            keyExtractor={(item) => item.itemId.toString()}
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
