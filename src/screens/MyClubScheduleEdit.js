import React, { useLayoutEffect, useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import ScheduleInput from '../components/ScheduleInput';
import ScheduleButton from '../components/ScheduleButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alert, Platform, Dimensions } from 'react-native';
import { DB, getCurrentUser } from '../utils/firebase';
import { ProgressContext } from '../contexts';

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

const ScheduleCreation = ({navigation, route}) => {
    const id = route.params.id;
    const clubId = route.params.clubId;
    const { spinner } = useContext(ProgressContext);
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

    const _handleTitleChange = text => {
        setTitle(text);
    }

    const _handleSiteChange = text => {
        setSite(text);
    }

    const _handleMemoChange = text => {
        setMemo(text);
    }


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

    const getSchedule = async () => {
      const scheduleRef = DB.collection('clubs').doc(clubId).collection('schedule').doc(id);
      const scheduleDoc = await scheduleRef.get();
      const data = scheduleDoc.data();

      console.log(data);

    }

    useEffect(() => {
      getSchedule();
    }, []);

    // 일정명이나 장소가 비었을 때 error 메시지 송출
    useEffect(() => {
        if (didMountRef.current) {
            const tempTime = new Date();
            let _errorMessage = '';
            if (!title) {
                _errorMessage = '일정명을 입력하세요.';
            }  else if (!site) {
                _errorMessage = '장소(모임형태)를 입력하세요.';
            } else if (date <= tempTime) {
                _errorMessage = '일정 시간을 확인해주세요.';
            } else {
                _errorMessage = '';
            }
            setErrorMessage(_errorMessage);
        } else {
            didMountRef.current = true;
        }
    }, [title, site, date]);

    useEffect(() => {
        setDisabled(
            !(title && date && site && !errorMessage)
        );
    }, [title, date, site, errorMessage]);

    const myClubScheduleWrite = async() => {
      const user = getCurrentUser();
      const scheduleRef = DB.collection('clubs').doc(id).collection('schedule').doc();

      const newSchedule = {
        id: scheduleRef.id,
        title,
        author: user,
        site: site,
        date: date,
        memo: memo,
        createAt: Date.now(),
      };

      await scheduleRef.set(newSchedule);

      console.log("upload complete");

      return true
    }

    // firebase 연동할 부분, 이전에는 콘솔 로그로 출력하게 두었습니다.
    const _handleCreationButtonPress = async() => {
        console.log(title);
        console.log(date);
        console.log(site);
        console.log(memo);
        try {
          spinner.start();
          await myClubScheduleWrite();
          navigation.navigate('MyClubTab', {screen: 'MyClubScheduleList'});
          Alert.alert('수정이 완료되었습니다.');
        }
        catch(e) {
          Alert.alert('수정된 글 업로드 오류', e.message);
        }
        finally {
          spinner.stop();

        }
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
                        onChangeText={_handleTitleChange}
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
                        onChangeText={_handleSiteChange}
                        placeholder="장소(모임형태)"
                        returnKeyType="next"
                    />
                    <ScheduleInput // 메모 입력 받기
                        value={memo}
                        onChangeText={_handleMemoChange}
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
