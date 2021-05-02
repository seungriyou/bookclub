// 일정 생성 화면
// 제목, 장소, 메모는 text로 받고, 일정은 datetimepicker을 이용해 시간과 날짜를 따로 받도록 하였습니다.
// 일단은 firebase 연동하지 않고 console창에 useState들을 출력하는 방식으로 제작했습니다.
// datetimepicker을 사용하기 위해 'npm instal @react-native-community/datetimepicker --save'로 관련 라이브러리를 설치해야합니다.

// theme.js에서 임의로 맞는 색상의 이름을 사용하였습니다.

// 추가할 component
// ScheduleInput: label이 가로에 위치하도록 기존 Input 수정
// ScheduleButton: 버튼 색상 수정


// 제가 개발 시 Stack Navigation을 따로 제작하여 만들었기 때문에, 오류가 있다면 바로 말씀해주시면 감사하겠습니다.


import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import ScheduleInput from '../components/ScheduleInput';
import ScheduleButton from '../components/ScheduleButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Alert, Platform, Dimensions } from 'react-native';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.buttonBackground};
    padding: 20px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    height: 20px;
    margin-bottom: 20px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
    font-size: 15px;
`;

const DateText = styled.Text`
    color: ${({ theme }) => theme.label};
    font-size: 20px;
    margin-bottom: 20px;
`;

const List = styled.ScrollView`
    flex: 1;
    width: ${({width})=>width-40}px;
`;

const DateButton = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.background};
    font-size: 20px;
    height: 50px;
    border-radius: 4px;
    margin-bottom: 20;
    align-items: center;
    justify-content: center;
`;

const DateButtonText = styled.Text`
    color: ${({ theme }) => theme.buttonBackground};
    font-size: 20px;
    align-items: center;
`;

const ScheduleCreation = ({navigation}) => {
    const [title, setTitle] = useState('');
    const today = new Date();
    const [date, setDate] = useState(new Date(today)); // datetimepicker 이용해 시간 입력받기
    const [mode, setMode] = useState('date'); // datetimepicker 관련
    const [show, setShow] = useState(false);  // datetimepicker 관련
    const [site, setSite] = useState('');
    const [memo, setMemo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    const width= Dimensions.get('window').width;

    const didMountRef = useRef();

    // 날짜 관련
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios' && 'android');
        setDate(currentDate);
    };

    // show mode 변경하기
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    // mode를 date로 변경 -> datepicker가 뜨게
    const showDatepicker = () => {
        showMode('date');
    };
    
    // mode를 time으로 변경 -> timepicker가 뜨게
    const showTimepicker = () => {
        showMode('time');
    };

    // 일정명이나 장소가 비었을 때 error 메시지 송출
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = '';
            if (!title) {
                _errorMessage = '일정명을 입력하세요.';
            }  else if (!site) {
                _errorMessage = '장소(모임형태)를 입력하세요.';
            } else {
                _errorMessage = '';
            }
            setErrorMessage(_errorMessage);
        } else {
            didMountRef.current = true;
        }
    }, [title, site]);

    useEffect(() => {
        setDisabled(
            !(title && date && site && !errorMessage)
        );
    }, [title, date, site, errorMessage]);

    // firebase 연동할 부분, 이전에는 콘솔 로그로 출력하게 두었습니다.
    const _handleCreationButtonPress = () => {
        console.log(title);
        console.log(date.toLocaleString());
        console.log(site);
        console.log(memo);
        Alert.alert('등록이 완료되었습니다.');
        navigation.navigate('MyClubScheduleList');
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraScrollHeight={20}
        >
            <Container>
                <List width={width}>
                    <ScheduleInput // 일정명 입력 받기
                        value={title}
                        onChangeText={text => setTitle(text)}
                        onSubmitEditing={() => {}}
                        placeholder="일정명"
                        returnKeyType="next"
                    />
                    <DateButton onPress={showDatepicker}>
                        <DateButtonText>날짜 선택</DateButtonText>
                    </DateButton>
                    <DateButton onPress={showTimepicker}>
                        <DateButtonText>시간 선택</DateButtonText>
                    </DateButton>
                    <DateText>선택 시간{"\n"}{date.toLocaleString()}</DateText>
                    <ScheduleInput // 장소 입력 받기
                        value={site}
                        onChangeText={text => setSite(text)}
                        onSubmitEditing={() => {}}
                        placeholder="장소(모임형태)"
                        returnKeyType="next"
                    />
                    <ScheduleInput // 메모 입력 받기
                        value={memo}
                        onChangeText={text => setMemo(text)}
                        onSubmitEditing={_handleCreationButtonPress}
                        placeholder="메모"
                        returnKeyType="done"
                    />
                    <ErrorText>{errorMessage}</ErrorText>
                    <ScheduleButton // 일정 등록 버튼
                        title="일정 등록"
                        onPress={_handleCreationButtonPress}
                        disabled={disabled}
                    />
                </List>
                { show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )
            }
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default ScheduleCreation;
