import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Club, ClubCreation, MyClubBoard, MyClubSchedule, MyClubAlbum, MyClubAlbumSelectPhoto } from '../screens';
import MainTab from './MainTab';
import MyClubTab from './MyClubTab';

const Stack = createStackNavigator();

const MyClubScheduleNav = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="MyClubScheduleNav"
      screenOptions={{
        headerTitleAlign: 'center',
      }}
      headerMode="screen"
    >
      <Stack.Screen name="MyClubSchedule" component={MyClubSchedule} />
    </Stack.Navigator>
  );
};

const MyClubBoardNav = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="MyClubBoardNav"
      screenOptions={{
        headerTitleAlign: 'center',
      }}
      headerMode="screen"
    >
      <Stack.Screen name="MyClubBoard" component={MyClubBoard} />
    </Stack.Navigator>
  );
};

const MyClubAlbumNav = () => {
  const theme = useContext(ThemeContext);
    return (
      <Stack.Navigator
        initialRouteName="MyClubAlbumNav"
        screenOptions={{
            headerTitleAlign: 'center',
            cardStyle: { backgroundColor: theme.background },
        }}
        headerMode="screen"
      >
        <Stack.Screen name="MyClubAlbum" component={MyClubAlbum} initialParams={[]} />
        <Stack.Screen name="MyClubAlbumSelectPhoto" component={MyClubAlbumSelectPhoto} />
      </Stack.Navigator>
    );
};
const MyClub = ({navigate, route}) => {
  const theme = useContext(ThemeContext);
  const id = route.params.id;
  const title = route.params.title;
  const currentClub = {
    id: id,
    title: title,
  };

  return (
    <Stack.Navigator
      initialRouteName="MyClub"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: theme.headerTintColor,
        cardStyle: { backgroundColor: theme.backgroundColor },
        headerBackTitleVisible: false,
      }}
      headerMode="screen"
    >
      <Stack.Screen name="MyClubTab" component={MyClubTab}  />
      <Stack.Screen name="MyClubBoardNav" component={MyClubBoardNav} options={{headerShown: false}}/>
      <Stack.Screen name="MyClubAlbumNav" component={MyClubAlbumNav} options={{ headerShown: false }} />

      <Stack.Screen name="MyClubScheduleNav" component={MyClubScheduleNav} options={{headerShown: false}}/>
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
      headerMode="float"
    >
      <Stack.Screen name="Main" component={MainTab} />
      <Stack.Screen name="Club Creation" component={ClubCreation} />
      <Stack.Screen name="Club" component={Club} />
      <Stack.Screen name="MyClub" component={MyClub} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default MainStack;
