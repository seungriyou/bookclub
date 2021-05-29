import React, { useContext, useLayoutEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { Spinner } from '../components';
import { ProgressContext, UserContext } from '../contexts';
import MainStack  from './MainStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from "react-native-crypto-js";

key = "AIzaSyBnpWF-z0x5PFDLYmFrWMntujb9aa_zGdY";

const Navigation = () => {
  const { inProgress } = useContext(ProgressContext);
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(UserContext);

  const getLocalUserData = async() => {
    const userData = await AsyncStorage.getItem('userData');
    if(userData != null) {
      const bytes = CryptoJS.AES.decrypt(userData, key);
      const originalUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      dispatch(originalUserData);
    }
  }

  useLayoutEffect(() => {
    getLocalUserData();
  }, []);

  return (
    <NavigationContainer>
      {user?.uid && user?.email ? <MainStack /> : <AuthStack />}
      {inProgress && <Spinner />}
    </NavigationContainer>
  );
};

export default Navigation;
