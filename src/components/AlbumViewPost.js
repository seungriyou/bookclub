// 앨범 탭에서 게시글을 조회할 때 사용되는 컴포넌트 

import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Image, ScrollView, useWindowDimensions, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../theme';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { downloadAsync } from 'expo-file-system';

const Container = styled.View`
  width: ${({ width }) => width - 40}px;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.inputBackground};
  margin: 20px;
  padding: 15px 15px;
  border-radius: 10px;
`;
const PostInfo = styled.View`
  width: ${({ width }) => (width - 40) * 0.92}px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
  padding-top: 6px;
  padding-bottom: 2px;
  margin: 0px;
`;
const PostInfo2 = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-left: 0px;
`;

const AlbumViewPost = ({ postInfo }) => {
  const width = useWindowDimensions().width;
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);

  const openModal = (index) => {
    setIsModalOpened(true);
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    return () => setIsModalOpened(false);
  }, []);

  // 로컬 앨범에 사진을 저장하기 위해 권한을 얻는 부분
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        console.log('The user has not granted us permission.');
      }
    })();    
  }, []);

  // 첨부된 이미지를 가로 ScrollView에 렌더링하는 함수
  const renderImage = (item, i) => {
    return (
      <TouchableWithoutFeedback onPress={() => openModal(i)}>
        <Image
          style={{ height: 140, width: 140, margin: 5, borderRadius: 10 }}
          source={{ uri: item.url }}
          key={i}
          resizeMethod="resize"
        />
      </TouchableWithoutFeedback>
    );
  };

  // 로컬 앨범에 사진을 저장하는 함수
  const _onSave = async (img) => {
    if (hasPermission) {
      const dirInfo = await FileSystem.cacheDirectory + 'album/';
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirInfo, { intermediates: true });
      }
      const url = await downloadAsync(img, dirInfo + 'bookclub'+ moment().format('YYMMDDHHmmss').toString() +'.jpg');
      console.log(`local uri: ${url.uri}`);
      await MediaLibrary.saveToLibraryAsync(url.uri);  
    }
  };

  const getDate = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format('MM/DD');
  };

  return (
    <Container width={width}>
      <PostInfo width={width}>
        <Text style={styles.titleText}>{postInfo.title}</Text>
      </PostInfo>
      <PostInfo width={width}>
        <Text style={styles.infoText}>작성자: {postInfo.writer_name}</Text>
        <PostInfo2>
          <Text style={styles.infoText}>{getDate(postInfo.upload_date)}</Text>
          <Text style={styles.infoText}>   댓글 {postInfo.comment_cnt}</Text>
        </PostInfo2>
      </PostInfo>
      <View style={{ height: 170 }}>
        <ScrollView
          horizontal={true}
          style={{ flexDirection: 'row', marginTop: 15 }}
        >
          {postInfo.photos.map((item, i) => renderImage(item, i))}
        </ScrollView>
      </View>
      <Text style={styles.contentText}>{postInfo.content}</Text>
      <Modal visible={isModalOpened} transparent={true}>
        <ImageViewer
          imageUrls={postInfo.photos}
          index={currentImageIndex}
          enableSwipeDown={true}
          onSwipeDown={() => setIsModalOpened(false)}
          menuContext={{ saveToLocal: '이미지 저장', cancel: '취소' }}
          onSave={_onSave}
        />
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    paddingBottom: 15,
  },
  infoText: {
    fontSize: 13,
    color: theme.infoText,
    paddingBottom: 5,
  },
  contentText: {
    fontSize: 16,
    paddingTop: 30,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
    lineHeight: 25,
  },
  separator: {
    borderBottomColor: theme.separator,
  }
});

AlbumViewPost.propTypes = {
  postInfo: PropTypes.object.isRequired,
};

export default AlbumViewPost;
