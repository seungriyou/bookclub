import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Image, ScrollView, useWindowDimensions } from 'react-native';
import AlbumTextContentInput from './AlbumTextContentInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';

// 탭바 때문에 height는 임의로 470px으로 지정함
const Container = styled.View`
  width: ${({ width }) => width - 40}px;
  height: 500px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.inputBackground};
  margin: 0px;
  padding: 5px 5px;
  border-radius: 10px;
`;

const PhotoButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.inputBackground};
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
`;

const PhotoButton = ({ onPress }) => {
  return (
    <PhotoButtonContainer onPress={onPress} >
      <PhotoButtonIcon />
    </PhotoButtonContainer>
  );
};

const PhotoButtonIcon = () => {
  return (
    <MaterialIcons
      name="collections"
      size={25}
      color={theme.buttonIcon}
    />
  );
};

const AlbumContentInput = ({ onPress, photos, text, onChangeText }) => {
  const width = useWindowDimensions().width;
  const renderImage = (item, i) => {
    return (
      <Image
        style={{ height: 120, width: 120, margin: 5, borderRadius: 10 }}
        source={{ uri: item.uri }}
        key={i}
      />
    );
  };

  return (
    <KeyboardAwareScrollView>
      <Container width={width}>
        <View style={{ height: 140 }}>
          <ScrollView
            horizontal={true}
            style={{ flexDirection: 'row' }}
          >
            {photos.map((item, i) => renderImage(item, i))}
          </ScrollView>
        </View>
        <PhotoButton onPress={onPress} />
        <View>
          <AlbumTextContentInput
            placeholder="내용 입력도 가능합니다."
            value={text}
            onChangeText={onChangeText}
          />
        </View>
      </Container>
    </KeyboardAwareScrollView>
  );

};

AlbumContentInput.propTypes = {
  onPress: PropTypes.func,
  photos: PropTypes.array,
  text: PropTypes.string,
  onChangeText: PropTypes.func,
};

export default AlbumContentInput;