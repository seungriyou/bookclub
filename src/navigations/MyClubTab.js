import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyClubMainInfo, MyClubAlbumList, MyClubBoardList, MyClubEssayList, MyClubScheduleList } from '../screens';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemeContext } from 'styled-components/native';
import styled from 'styled-components/native';

const Layout=styled.View`
    background-color: ${({theme})=>theme.background};
    align-items: center;
    flex-direction: row;
`;

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
    //const titles = route.state?.routeNames || ['MainInfo'];
    const titles = ['메인화면', '게시판', '앨범', '에세이', '일정'];
    const id = route.params?.id;
    const index = route.state?.index || 0;
    navigation.setOptions({
      headerTitle: titles[index],
      headerLeft: () => {
        if (index === 0)
        return(
          <Layout>
            <MaterialCommunityIcons
                name="keyboard-backspace"
                size={30}
                style={{marginLeft:13}}

                onPress={()=>navigation.navigate('MyClubList')}   //뒤로가기
            />
            <MaterialCommunityIcons
                name="alert-circle"
                size={30}
                style={{marginLeft:10}}

                onPress={()=>{navigation.navigate('MyClubMainInfoNav', {screen:'MyClubMainManage', params: {id: id}})}}   //클럽 정보를 관리하는 MyClubMainManage로 이동
                //navigation.navigate('MyClubMainInfoNav', {screen: 'MyClubMainManage', params: {id: id}})
            />
          </Layout>
        )
        else {
          return(
            <MaterialCommunityIcons
                name="keyboard-backspace"
                size={30}
                style={{marginLeft:13}}

                onPress={()=>navigation.navigate('MyClubList')}   //뒤로가기
            />
          )
        }
      },
      headerRight: () =>
        { if (index === 0)
            {
              return (
              <Layout>
              <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={30}
                  style={{marginRight:10}}

                  onPress={()=>{console.log("navigate to book complete list page")}}   //수정필요-진행완료된 책 화면으로 이동

              />
              <MaterialCommunityIcons
                  name="magnify"
                  size={30}
                  style={{marginRight:10}}

                  onPress={()=>{navigation.navigate('MyClubMainInfoNav', {screen:'MyClubBookSearch', params: {id: id}})}}  //수정필요-책 추천화면 이동
              />
              </Layout>
            )}
          if (index === 1)
            return (
              <MaterialIcons
                name="edit"
                size={26}
                style={{ margin: 10 }}
                onPress={() => navigation.navigate('MyClubBoardNav', {screen: 'MyClubBoard', params: {id: id}})}
              />
            );
          else if (index === 2)
            return (
              <MaterialIcons
                name="edit"
                size={26}
                style={{ margin: 10 }}
                onPress={() => navigation.navigate('MyClubAlbumNav', {screen: 'MyClubAlbum', params: {id: id}})}
              />
            );
            else if (index === 3)
              return (
                <Layout>
                <Ionicons
                  name="heart"
                  size={26}
                  style={{ margin: 10 }}
                  onPress={() => navigation.navigate('MyClubEssayNav', {screen: 'MyClubEssayLikeList', params: {id: id}})}
                />
                <MaterialIcons
                  name="edit"
                  size={26}
                  style={{ margin: 10 }}
                  onPress={() => navigation.navigate('MyClubEssayNav', {screen: 'MyClubEssay', params: {id: id}})}
                />
                </Layout>
              );
          else if (index === 4)
            return (
              <MaterialIcons
                name="edit"
                size={26}
                style={{ margin: 10 }}
                onPress={() => navigation.navigate('MyClubScheduleNav', {screen: 'MyClubSchedule', params: {id: id}})}
              />
            );
        },
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
          name="Books"
          component={MyClubMainInfo}
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
