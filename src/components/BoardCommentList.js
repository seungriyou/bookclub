// 게시판에서 사용될 댓글 리스트를 불러오는 컴포넌트

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, useWindowDimensions, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Container = styled.View`
  width: ${({ width }) => width - 40}px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.inputBackground};
  margin: 10px 0 0 0;
  padding: 0px 5px;
  border-radius: 10px;
`;
const CommentHeader = styled.View`
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


const CommentButtonArea = styled.View`
  flex-direction: row;
`;

const CommentButtonContainer = styled.TouchableOpacity`
  width: 30px;
  height: 25px;
  justify-content: center;
  align-items: flex-end;
  padding-right: 1px;
  padding-left: 3px;
`;

const DeleteButtonIcon = () => {
  return (
    <MaterialCommunityIcons
      name="delete"
      size={20}
      color={theme.buttonIcon}
    />
  );
};

const DeleteButton = ({ onPress }) => {
  return (
    <CommentButtonContainer onPress={onPress}>
      <DeleteButtonIcon />
    </CommentButtonContainer>
  );
};

const EditButtonIcon = () => {
  return (
    <MaterialCommunityIcons
      name="pencil"
      size={20}
      color={theme.buttonIcon}
    />
  );
};

const EditButton = ({ onPress }) => {
  return (
    <CommentButtonContainer onPress={onPress}>
      <EditButtonIcon />
    </CommentButtonContainer>
  );
};


const BoardCommentList = ({ postInfo, userInfo, clubId, onDelete, onEdit }) => {
  const width = useWindowDimensions().width;
  const comments = postInfo.comment;
  const userId = userInfo.uid;

  const getDate = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format('MM/DD');
  };


  const _editComment = async(id) => {
    onEdit(id)
  };
  const _deleteComment = async(id) => {
    onDelete(id);
  };

  const renderItem = ({ item }) => {
    const isButtonRender = (item.writer.uid == userId);

    return (isButtonRender ? (
      <CommentArea width={width}>
        <CommentHeader>
          <Text style={styles.writerText}>{item.writer.name}</Text>
          <CommentButtonArea>
            <EditButton onPress={()=>{_editComment(item.id)}}/>
            <DeleteButton onPress={()=>{_deleteComment(item.id)}}/>
          </CommentButtonArea>
        </CommentHeader>
        <Text style={styles.contentText}>{item.content}</Text>
        <Text style={styles.infoText}>{getDate(item.upload_date)}</Text>
      </CommentArea>
    ) : (
      <CommentArea width={width}>
        <CommentHeader>
          <Text style={styles.writerText}>{item.writer.name}</Text>
        </CommentHeader>
        <Text style={styles.contentText}>{item.content}</Text>
        <Text style={styles.infoText}>{getDate(item.upload_date)}</Text>
      </CommentArea>
    )
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
    paddingTop: 1,
  },
  infoText: {
    fontSize: 13,
    color: theme.infoTextComment,
    paddingBottom: 1,
  },
  contentText: {
    fontSize: 15,
    paddingTop: 4,
    paddingBottom: 5,
    lineHeight: 22,
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
