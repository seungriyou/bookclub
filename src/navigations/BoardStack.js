import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BoardWrite from '../screens/BoardWrite';
import test from '../screens/test'; //상단바 확인용 테스트 화면(사용X)



const Stack=createStackNavigator();

const StackNavigation=()=>{
    return(
        <Stack.Navigator
            screenOptions ={{
                headerTitleAlign: 'center',
            }}>
            <Stack.Screen name="Boardwrite" component={BoardWrite} />
            <Stack.Screen name="test" component={test} />
            
        </Stack.Navigator>
    );
};

export default StackNavigation;