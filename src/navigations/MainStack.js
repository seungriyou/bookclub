import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Club, ClubCreation } from '../screens';
import MainTab from './MainTab';
import MyClubTab from './MyClubTab';

const Stack = createStackNavigator();

const MyClub = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="MyClub"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: theme.headerTintColor,
        cardStyle: { backgroundColor: theme.backgroundColor },
        headerBackTitleVisible: false,
      }}
      headerMode="none"
    >
      <Stack.Screen name="MyClubMain" component={MyClubTab} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: theme.headerTintColor,
        cardStyle: { backgroundColor: theme.backgroundColor },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTab} />
      <Stack.Screen name="Club Creation" component={ClubCreation} />
      <Stack.Screen name="Club" component={Club} />
      <Stack.Screen name="MyClub" component={MyClub}/>
    </Stack.Navigator>
  );
};

export default MainStack;
