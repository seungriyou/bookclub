// 일정 생성 화면
// 제목, 장소, 메모는 text로 받고, 일정은 datetimepicker을 이용해 시간과 날짜를 따로 받도록 하였습니다.
// 일단은 firebase 연동하지 않고 console창에 useState들을 출력하는 방식으로 제작했습니다.
// datetimepicker을 사용하기 위해 'npm instal @react-native-community/datetimepicker --save'로 관련 라이브러리를 설치해야합니다.

// theme.js에서 임의로 맞는 색상의 이름을 사용하였습니다.

// 추가할 component
// ScheduleInput: label이 가로에 위치하도록 기존 Input 수정
//일정 작성 화면
//일정명, 날짜 및 시간, 장소, 메모를 picker와 input 컴포넌트를 통해 입력받고 등록합니다.


import React, { useState, useRef, useEffect, useContext } from 'react';
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
    width: ${({width})=>width}px;
    flex-direction: column;
    align-items: center
    background-color: ${({ theme }) => theme.buttonBackground};
    paddingTop: 40px;
`;

const Fix=styled.View`
    align-items: flex-start;
    justify-content: flex-start;
    width: ${({width})=>(width)-60}px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    height: 40px;
    margin-bottom: 40px;
    color: ${({ theme }) => theme.errorText};
    font-size: 15px;
`;

const DateText = styled.Text`
    color: ${({ theme }) => theme.text};
    font-size: 18px;
    margin-bottom: 20px;
`;

const Box = styled.View`
    width=10px;
    height: 60px;
`;

const List = styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const DateButton = styled.TouchableOpacity`
    width: ${({width})=>(width)-40}px;
    background-color: ${({ theme }) => theme.background};
    font-size: 18px;
    height: 50px;
    border-radius: 4px;
    margin-bottom: 20;
    align-items: center;
    justify-content: center;
`;

const DateButtonText = styled.Text`
    color: ${({ theme }) => theme.appBackground};
    font-size: 18px;
    align-items: center;
`;

const ScheduleCreation = ({navigation, route}) => {
    const { spinner } = useContext(ProgressContext);
    const [title, setTitle] = useState('');
    const [id, setId] = useState(0);
    const today = new Date();
    const [date, setDate] = useState(new Date(today)); 
    const [mode, setMode] = useState('date'); 
    const [show, setShow] = useState(false);  
    const [site, setSite] = useState('');
    const [memo, setMemo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    const width= Dimensions.get('window').width;

    const didMountRef = useRef();


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



    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };


    const showDatepicker = () => {
        showMode('date');
    };

 
    const showTimepicker = () => {
        showMode('time');
    };

    useEffect(() => {
      setId(route.params?.id);
    }, []);


    useEffect(() => {
        if (didMountRef.current) {
            const tempTime = new Date();
            let _errorMessage = '';
            if (!title) {
                _errorMessage = '일정명을 입력하세요.';
            }  else if (!site) {
                _errorMessage = '장소를 입력하세요.';
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


    const _handleCreationButtonPress = async() => {
        console.log(title);
        console.log(date);
        console.log(site);
        console.log(memo);
        try {
          spinner.start();
          await myClubScheduleWrite();
          navigation.navigate('MyClubTab', {screen: 'MyClubScheduleList'});
          Alert.alert('일정 등록이 완료되었습니다.');
        }
        catch(e) {
          Alert.alert('일정 업로드 오류', e.message);
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
            <List width={width}>
            <Container width={width}>
                
                    <ScheduleInput 
                        value={title}
                        onChangeText={_handleTitleChange}
                        onSubmitEditing={() => {}}
                        placeholder="일정명"
                        returnKeyType="next"
                    />
                    <DateButton width={width} onPress={showDatepicker}>
                        <DateButtonText>날짜 선택</DateButtonText>
                    </DateButton>
                    <DateButton width={width} onPress={showTimepicker}>
                        <DateButtonText>시간 선택</DateButtonText>
                    </DateButton>
                    <Fix width={width}>
                    <DateText>선택 시간{"\n"}{date.toLocaleString()}</DateText>
                    </Fix>
                    <ScheduleInput 
                        value={site}
                        onChangeText={_handleSiteChange}
                        placeholder="장소"
                        returnKeyType="next"
                    />
                    <ScheduleInput 
                        value={memo}
                        onChangeText={_handleMemoChange}
                        placeholder="메모"
                        returnKeyType="done"
                        multiline={true}
                    />
                    <Fix width={width}>
                    <ErrorText>{errorMessage}</ErrorText>
                    </Fix>
                    <ScheduleButton 
                        title="일정 등록"
                        onPress={_handleCreationButtonPress}
                        disabled={disabled}
                    />
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
            <Box/>
            </Container>
            </List>
        </KeyboardAwareScrollView>
    );
};

export default ScheduleCreation;
