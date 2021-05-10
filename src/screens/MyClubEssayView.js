import React, { useState, useEffect, useLayoutEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import EssayViewPost from '../components/EssayViewPost';
import EssayCommentList from '../components/EssayCommentList';
import ReplyInput from '../components/ReplyInput';

const tempData = {
  "title": "리스본행 야간열차 (파스칼 메르시어)",
  "writer_name": "관리자",
  "upload_date": "2021/05/05",
  "comment_cnt": 2,
  "comment": [
    {
      "id": 1,
      "writer_name": "멤버A",
      "content": "우리가 우리 안에 있는 것들 가운데 아주 작은 부분만을 경험할 수 있다면 나머지는 어떻게 되는 걸까요?",
      "upload_date": "2021/05/05",
    },
    {
      "id": 2,
      "writer_name": "멤버B",
      "content": "'언어의 연금술사'라는 책이 실제로 있다면 읽어보고 싶네요",
      "upload_date": "2021/05/05",
    }
  ],
  "ocr_text": "-뚜렷하지 않은 심연. 인간 행위의 표면 아래에 우리가 알지 못하는 어떤 비밀이 있을까? 아니면 인간은 자신이 만천하에 드러내는 행동과 완벽하게 일치할까? 아주 이상하게 들리지만, 이 질문에 대한 대답은 이 도시와 타호 강을 비추는 햇빛처럼 내 마음속에서 늘 변한다. 뚜렷하고 예리한 그림자를 만드는, 반짝이는 8월의 매력적인 햇빛은 인간에게 숨겨진 심연이 있다는 나의 생각을 터무니없는 것으로 느끼게 만든다.",
  "content": "파스칼 메르시어의 '리스본행 야간열차'를 읽고 인상적이었던 부분입니다.\n\n소설 속에 등장하는 또 다른 책인 '언어의 연금술사'에 나오는 구절입니다.\n\n책의 36페이지 하단에 위치해있습니다.",
  "like_cnt": 10,
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.appBackground};
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 100px;
`;
const CommentForm = styled.View`
  position: absolute;
  bottom: 0;     
  background-color: ${({ theme }) => theme.background};
  align-items: center;
`;

const MyClubEssayView = ({ navigation }) => {
  const [comment, setComment] = useState('');
  const _handleReplyChange = text => {
    setComment(text);
  };

  const _addReply = () => {
    if (!comment) {
      alert("댓글을 입력해주세요.");
    }
    else {
      alert(`댓글을 입력하였습니다. 댓글 내용:\n${comment}`);
      console.log(`Comment: ${comment}`);
      setComment('');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ onPress }) => {
        return (
          <MaterialIcons
            name="keyboard-backspace"
            size={30}
            style={{ marginLeft: 13 }}
            color={theme.buttonIcon}
            onPress={onPress}
          />
        );
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Ionicons
            name="heart"
            size={30}
            style={{ marginRight: 20 }}
            color={theme.buttonIcon}
            onPress={() => { alert("좋아요!") }} // 좋아요 버튼 함수(이벤트 추가 필요)
          />
          <MaterialIcons
            name="edit"
            size={30}
            style={{ marginRight: 13 }}
            color={theme.buttonIcon}
            onPress={() => { alert("글을 수정합니다.") }} //글 수정 버튼 함수(이벤트 추가 필요)
          />
        </View>
        
      ),
    });
    //console.log(navigation);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <KeyboardAwareScrollView extraScrollHeight={20}>
        <Container>
          <EssayViewPost postInfo={tempData}></EssayViewPost>
          {!tempData.comment_cnt || <EssayCommentList postInfo={tempData}></EssayCommentList>}
        </Container>
      </KeyboardAwareScrollView>
      <CommentForm>
        <ReplyInput
          placeholder="댓글을 입력하세요."
          value={comment}
          onChangeText={_handleReplyChange}
          onSubmitEditing={() => { }}
          onPress={_addReply}
        />
      </CommentForm>
    </View>
  )
};

export default MyClubEssayView;