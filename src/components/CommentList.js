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

const CommentList = ({ postInfo }) => {
  const width = useWindowDimensions().width;
  const comments = postInfo.comment;
  /*console.log(comments)*/

  const getDate = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format('MM/DD');
  };

  // 댓글 수정, 삭제 함수 (수정 필요)
  const _editComment = () => {
    alert('edit!');
  };
  const _deleteComment = () => {
    alert('delete!');
  };

  const renderItem = ({ item }) => {
    return (
      <CommentArea>
        <CommentHeader width={width}>
          <Text style={styles.writerText}>{item.writer.name}</Text>
          {/* 조건부 렌더링 필요 => 현재 user가 writer인 댓글에서만 CommentButtonArea를 보여줘야 함 */}
          <CommentButtonArea>
            {/* 각 버튼의 onPress에 수정, 삭제 함수를 넣어야 함 */}
            <EditButton onPress={_editComment}/>
            <DeleteButton onPress={_deleteComment}/>
          </CommentButtonArea>
        </CommentHeader>
        <View style={{ width: width-75 }}>
          <Text style={styles.contentText}>{item.content}</Text>
        </View>
        <Text style={styles.infoText}>{getDate(item.upload_date)}</Text>
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
