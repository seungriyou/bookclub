import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Club, ClubCreation, MyClubBoard,MyClubBoardEdit,
  MyClubBoardView, MyClubSchedule, MyClubScheduleEdit, MyClubAlbum,
  MyClubAlbumSelectPhoto, MyClubAlbumView, MyClubEssay,
  MyClubEssayView, MyClubEssayLikeList, MyClubEssayEdit, MyClubMainInfo_1,
  MyClubMainInfo_2, MyClubMainM, MyClubMainManage,
  MyClubUserAdmin, MyClubWaitAdmin, MyClubBookSearch } from '../screens';
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
      <Stack.Screen name="MyClubMainInfo_1" component={MyClubMainInfo_1} options={{title: "독서 목표 수정"}}/>
      <Stack.Screen name="MyClubMainInfo_2" component={MyClubMainInfo_2} options={{title: "독서 진행상황 수정"}}/>
      <Stack.Screen name="MyClubMainM" component={MyClubMainM} options={{title: "클럽 정보 수정"}}/>
      <Stack.Screen name="MyClubMainManage" component={MyClubMainManage} options={{title: "클럽 정보"}}/>
      <Stack.Screen name="MyClubUserAdmin" component={MyClubUserAdmin} options={{title: "클럽원 목록"}}/>
      <Stack.Screen name="MyClubWaitAdmin" component={MyClubWaitAdmin} options={{title: "가입 대기중인 회원"}}/>
      <Stack.Screen name="MyClubBookSearch" component={MyClubBookSearch} options={{title: "도서 검색"}}/>
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
      <Stack.Screen name="MyClubBoard" component={MyClubBoard} options={{title: "게시판 글 작성"}}/>
      <Stack.Screen name="MyClubBoardView" component={MyClubBoardView} options={{title: "게시판"}}/>
      <Stack.Screen name="MyClubBoardEdit" component={MyClubBoardEdit} options={{title: "게시판 글 수정"}}/>
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
      <Stack.Screen name="MyClubAlbum" component={MyClubAlbum} options={{title: "앨범 작성"}} />
      <Stack.Screen name="MyClubAlbumSelectPhoto" component={MyClubAlbumSelectPhoto} options={{title: "사진 선택"}}/>
      <Stack.Screen name="MyClubAlbumView" component={MyClubAlbumView} options={{title: "앨범 조회"}}/>
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
      <Stack.Screen name="MyClubEssay" component={MyClubEssay} options={{title: "에세이 작성"}}/>
      <Stack.Screen name="MyClubEssayView" component={MyClubEssayView} options={{title: "에세이 조회"}}/>
      <Stack.Screen name="MyClubEssayLikeList" component={MyClubEssayLikeList} options={{title: "좋아요한 에세이"}}/>
      <Stack.Screen name="MyClubEssayEdit" component={MyClubEssayEdit} options={{title: "에세이 수정"}}/>
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
      <Stack.Screen name="MyClubSchedule" component={MyClubSchedule} options={{title: "일정"}}/>
      <Stack.Screen name="MyClubScheduleEdit" component={MyClubScheduleEdit} options={{title: "일정 수정"}}/>
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
      <Stack.Screen name="Club Creation" component={ClubCreation} options={{title: "클럽 생성"}}/>
      <Stack.Screen name="Club" component={Club} options={{title: "클럽 조회"}}/>
      <Stack.Screen name="MyClub" component={MyClub} options={{headerShown: false, title: "내 클럽"}}/>
    </Stack.Navigator>
  );
};
//
export default MainStack;
