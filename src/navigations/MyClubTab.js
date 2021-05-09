import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyClubMain, MyClubAlbumList, MyClubBoardList, MyClubEssayList, MyClubScheduleList } from '../screens';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from 'styled-components/native';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, name }) => {
  const theme = useContext(ThemeContext);
  return (
    <MaterialIcons
      name={name}
      size={24}
      color={focused ? theme.tabActiveColor : theme.tabInactiveColor}
    />
  );
};

const MainTab = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    const titles = route.state?.routeNames || ['Clubs'];
    const id = route.params?.id;
    const index = route.state?.index || 0;
    navigation.setOptions({
      headerTitle: titles[index],
      headerRight: () =>
        index === 2 && (
          <MaterialIcons
            name="edit"
            size={26}
            style={{ margin: 10 }}
            onPress={() => navigation.navigate('MyClubAlbumNav', {screen: 'MyClubAlbum', params: {id: id}})}
          />
        ),
    });
  }, [route]);

  return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: theme.tabActiveColor,
          tabInactiveColor: theme.tabInactiveColor,
        }}
      >
        <Tab.Screen
          name="MyClubMain"
          component={MyClubMain}
          options={{
            tabBarIcon: ({ focused }) =>
              TabBarIcon({
                focused,
                name: focused ? 'menu-book' : 'book',
              }),
          }}
          initialParams={route.params}
        />
        <Tab.Screen
          name="Board"
          component={MyClubBoardList}
          options={{
            tabBarIcon: ({ focused }) =>
              TabBarIcon({
                focused,
                name: focused ? 'menu-book' : 'book',
              }),
          }}
          initialParams={route.params}
        />
        <Tab.Screen
          name="Album"
          component={MyClubAlbumList}
          options={{
            tabBarIcon: ({ focused }) =>
              TabBarIcon({
                focused,
                name: focused ? 'menu-book' : 'book',
              }),
          }}
          initialParams={route.params}
        />
        <Tab.Screen
          name="Essay"
          component={MyClubEssayList}
          options={{
            tabBarIcon: ({ focused }) =>
              TabBarIcon({
                focused,
                name: focused ? 'menu-book' : 'book',
              }),
          }}
          initialParams={route.params}
        />
        <Tab.Screen
          name="Schedule"
          component={MyClubScheduleList}
          options={{
            tabBarIcon: ({ focused }) =>
              TabBarIcon({
                focused,
                name: focused ? 'menu-book' : 'book',
              }),
          }}
          initialParams={route.params}
        />
      </Tab.Navigator>
  );
};

export default MainTab;
