import React from 'react';
import { theme } from '../theme';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageBrowser } from 'expo-image-picker-multiple';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SelectPhoto = ({ navigation }) => {
  const _getHeaderLoader = () => (
    <ActivityIndicator size={30} color={theme.buttonIcon} style={{ marginRight: 13 }} />
  );

  const imagesCallback = (callback) => {
    navigation.setOptions({
      headerRight: () => _getHeaderLoader()
    });
    callback.then(async (photos) => {
      const cPhotos = [];
      for (let photo of photos) {
        const pPhoto = await _processImageAsync(photo.uri);
        cPhotos.push({
          uri: pPhoto.uri,
          name: photo.filename,
          type: 'image/jpg'
        })
      }
      navigation.navigate('MyClubAlbum', { photos: cPhotos });
      //console.log(cPhotos);
    })
      .catch((e) => console.log(e));
  };

  const _processImageAsync = async uri => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  const _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return (
      <TouchableOpacity title={'Done'} onPress={onSubmit}>
        <MaterialCommunityIcons
          name="check"
          size={30}
          style={{ marginRight: 13 }}
          color={theme.buttonIcon}
          onPress={onSubmit}
        />
      </TouchableOpacity>
    );
  };

  const updateHandler = (count, onSubmit) => {
    navigation.setOptions({
      title: `Selected ${count} images`,
      headerRight: () => _renderDoneButton(count, onSubmit)
    });
  };

  const renderSelectedComponent = (number) => {
    return (
      <View style={styles.countBadge}>
        <Text style={styles.countBadgeText}>{number}</Text>
      </View>
    );
  };

  const emptyStayComponent = <Text style={styles.emptyStay}>Your Album is Empty :(</Text>;

  return (
    <View style={[styles.flex, styles.container]}>
      <ImageBrowser
        max={10}
        onChange={updateHandler}
        callback={imagesCallback}
        renderSelectedComponent={renderSelectedComponent}
        emptyStayComponent={emptyStayComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
  },
  emptyStay: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff',
  },
});

export default SelectPhoto;