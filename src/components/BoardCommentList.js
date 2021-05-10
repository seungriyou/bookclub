import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, useWindowDimensions, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import moment from 'moment';

const Container = styled.View`
  width: ${({ width }) => width - 40}px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.inputBackground};
  margin: 10px 0 0 0;
  padding: 0px 5px;
`;
const CommentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;
const CommentArea = styled.View`
  width: ${({ width }) => (width - 40) * 0.92}px;
  flex-direction: column;
  justify-content: flex-start;
  margin: 7px;
  padding: 5px 5px;
`;

const BoardCommentList = ({ postInfo }) => {
  const width = useWindowDimensions().width;
  const comments = postInfo.comment;
  /*console.log(comments)*/

  const getDate = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format('MM/DD');
  };

  const renderItem = ({ item }) => {
    return (
      <CommentArea width={width}>
        <CommentInfo>
          <Text style={styles.writerText}>{item.writer.name}</Text>
          <Text style={styles.infoText}>{getDate(item.upload_date)}</Text>
        </CommentInfo>
        <Text style={styles.contentText}>{item.content}</Text>
      </CommentArea>
    );
  };

  return (
    <Container width={width}>
      <FlatList
        nestedScrollEnabled={true}
        keyExtractor={(item) => item.id.toString()}
        data={comments}
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
  writerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    paddingTop: 6,
  },
  infoText: {
    fontSize: 13,
    color: theme.infoTextComment,
    paddingBottom: 5,
  },
  contentText: {
    fontSize: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  separator: {
    height: 0.8,
    backgroundColor: theme.separator,
  }
});

BoardCommentList.propTypes = {
  postInfo: PropTypes.object.isRequired,
};

export default BoardCommentList;
