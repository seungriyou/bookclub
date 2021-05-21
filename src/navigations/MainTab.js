import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile, ClubList, MyClubList } from '../screens';
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
    //const titles = route.state?.routeNames || ['Clubs'];
    const titles = ['클럽 목록', '내가 가입한 클럽 목록', '내 프로필'];
    const index = route.state?.index || 0;
    navigation.setOptions({
      headerTitle: titles[index],
      headerRight: () =>
        index === 0 && (
          <MaterialIcons
            name="add"
            size={26}
            style={{ margin: 10 }}
            onPress={() => navigation.navigate('Club Creation')}
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
          name="Clubs"
          component={ClubList}
          options={{
            tabBarIcon: ({ focused }) =>
              TabBarIcon({
                focused,
                name: focused ? 'menu-book' : 'book',
              }),
          }}
        />
        <Tab.Screen
          name="MyClubList"
          component={MyClubList}
          options={{
            tabBarIcon: ({ focused }) =>
              TabBarIcon({
                focused,
                name: focused ? 'menu-book' : 'book',
              }),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) =>
            TabBarIcon({
              focused,
              name: focused ? 'person' : 'person-outline',
            }),
          }}
        />
    </Tab.Navigator>

  );
};

export default MainTab;
