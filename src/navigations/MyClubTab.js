import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyClubMain } from '../screens';
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
    const index = route.state?.index || 0;
    navigation.setOptions({
      headerTitle: titles[index]
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
      />
    </Tab.Navigator>
  );
};

export default MainTab;
