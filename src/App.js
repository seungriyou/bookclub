//앱의 기초 뼈대

import React, { useState } from 'react';
import { StatusBar, Image, SafeAreaView } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Navigation from './navigations';
import { images } from './utils/images';
import { ProgressProvider, UserProvider } from './contexts';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(); //에러메세지 출력 끄기

const cashImages = images => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const cacheFonts = fonts => { //폰트를 미리 로딩시켜주는 함수
  return fonts.map(font => Font.loadAsync(font));
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [fontLoaded] = Font.useFonts({
    RIDIBatang: require('../assets/fonts/RIDIBatang.ttf'),
  });

  const _loadAssets = async () => { //앱의 로딩화면 
    const imageAssets = cacheImages([
      require('../assets/splash.png'),
      ...Object.values(images),
    ]);
    const fontAssets = cacheFonts([]);

    await Promise.all([...imageAssets, ...fontAssets]);
  };

  return isReady && fontLoaded ? (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <ProgressProvider>
          <StatusBar barStyle="light-content" />
          <Navigation />
        </ProgressProvider>
      </UserProvider>
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={_loadAssets}
      onFinish={() => setIsReady(true)}
      onError={console.warn}
    />
  );
};

export default App;
