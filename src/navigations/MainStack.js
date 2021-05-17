import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Club, ClubCreation, MyClubBoard,MyClubBoardEdit,
  MyClubBoardView, MyClubSchedule, MyClubScheduleEdit, MyClubAlbum,
  MyClubAlbumSelectPhoto, MyClubAlbumView, MyClubEssay,
  MyClubEssayView, MyClubMainInfo_1,
  MyClubMainInfo_2, MyClubMainM, MyClubMainManage,
  MyClubUserAdmin, MyClubWaitAdmin } from '../screens';
import MainTab from './MainTab';
import MyClubTab from './MyClubTab';

const Stack = createStackNavigator();

const MyClubMainInfoNav = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="MyClubMainInfoNav"
      screenOptions={{
          headerTitleAlign: 'center',
      }}
      headerMode="screen"
    >
      <Stack.Screen name="MyClubMainInfo_1" component={MyClubMainInfo_1} />
      <Stack.Screen name="MyClubMainInfo_2" component={MyClubMainInfo_2} />
      <Stack.Screen name="MyClubMainM" component={MyClubMainM} />
      <Stack.Screen name="MyClubMainManage" component={MyClubMainManage} />
      <Stack.Screen name="MyClubUserAdmin" component={MyClubUserAdmin} />
      <Stack.Screen name="MyClubWaitAdmin" component={MyClubWaitAdmin} />
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
      <Stack.Screen name="MyClubBoardView" component={MyClubBoardView} />
      <Stack.Screen name="MyClubBoardEdit" component={MyClubBoardEdit} />
    </Stack.Navigator>
  );
};

const MyClubAlbumNav = ({navigate, route}) => {
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
      <Stack.Screen name="MyClubAlbumView" component={MyClubAlbumView} />
    </Stack.Navigator>
  );
};

const MyClubEssayNav = ({navigate, route}) => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="MyClubEssayNav"
      screenOptions={{
          headerTitleAlign: 'center',
          cardStyle: { backgroundColor: theme.background },
      }}
      headerMode="screen"
    >
      <Stack.Screen name="MyClubEssay" component={MyClubEssay} />
      <Stack.Screen name="MyClubEssayView" component={MyClubEssayView} />
    </Stack.Navigator>
  );
};

const MyClubScheduleNav = ({navigate, route}) => {
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
      <Stack.Screen name="MyClubScheduleEdit" component={MyClubScheduleEdit} />
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
      <Stack.Screen name="MyClubTab" component={MyClubTab} />
      <Stack.Screen name="MyClubMainInfoNav" component={MyClubMainInfoNav} options={{headerShown: false}}/>
      <Stack.Screen name="MyClubBoardNav" component={MyClubBoardNav} options={{headerShown: false}}/>
      <Stack.Screen name="MyClubAlbumNav" component={MyClubAlbumNav} options={{ headerShown: false }} />
      <Stack.Screen name="MyClubEssayNav" component={MyClubEssayNav} options={{ headerShown: false }} />
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
