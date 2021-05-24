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
  margin: 5px;
  padding: 0px 5px;
  border-radius: 10px;
`;
const CommentHeader = styled.View`
  width: ${({ width }) => width - 75}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;
const CommentArea = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  margin: 7px;
  padding: 5px 5px;
`;

// 삭제, 수정 버튼
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

const CommentList = ({ postInfo, userInfo, clubId, onDelete, onEdit }) => {
  const width = useWindowDimensions().width;
  const comments = postInfo.comment;
  const userId = userInfo.uid;
  /*console.log(comments)*/

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
      <CommentArea >
        <CommentHeader width={width}>
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
      <CommentArea>
        <CommentHeader width={width}>
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
    color: theme.text,
    lineHeight: 22,
  },
  separator: {
    height: 0.8,
    backgroundColor: theme.separator,
  }
});

CommentList.propTypes = {
  postInfo: PropTypes.object.isRequired,
};

export default CommentList;
