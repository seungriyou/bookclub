import React, { useContext, useLayoutEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { Spinner } from '../components';
import { ProgressContext, UserContext } from '../contexts';
import MainStack  from './MainStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navigation = () => {
  const { inProgress } = useContext(ProgressContext);
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(UserContext);

  const getLocalUserData = async() => {
    let userData = await AsyncStorage.getItem('userData');
    if(userData != null) {
      userData = JSON.parse(userData);
      dispatch(userData.user);
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
