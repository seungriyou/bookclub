// 클럽 정보를 수정하는 화면
// 각 input의 placeholder은 기존의 값을 가져오면 될 것 같습니다.
// 정보 수정 완료 함수가 필요합니다.


import React, {useLayoutEffect, useState, useEffect, useRef, forwardRef} from 'react';
import {StyleSheet, Dimensions, Text, Button, Image, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import PropTypes from 'prop-types';
import { DB, getCurrentUser } from '../utils/firebase';
import {Picker} from '@react-native-picker/picker';

const StyledIntroInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    width: ${({width})=>width}px;
    border-radius: 5px;
    padding: 15px 15px 15px 15px;
    background-color: ${({theme})=>theme.inputBackground};
    font-size: 16px;
    color: ${({theme})=>theme.text};
    textAlignVertical="top";
`;

const IntroInput= forwardRef(({placeholder, value, onChangeText, onSubmitEditing},ref)=>{
    const width = Dimensions.get('window').width;

    return <StyledIntroInput
        width={width}
        placeholder={placeholder}
        maxLength={150}
        multiline={true}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType= "next"

        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        />
}
);

IntroInput.propTypes={
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
};



const StyledInput=styled.TextInput.attrs(({theme})=>({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    width: ${({width})=>width-60}px;
    border-radius: 5px;
    padding: 15px 15px 15px 15px;
    background-color: ${({theme})=>theme.inputBackground};
    font-size: 16px;
    color: ${({theme})=>theme.text};
    textAlignVertical="top";
`;

const Input= forwardRef(({placeholder, value, onChangeText, onSubmitEditing},ref)=>{
    const width = Dimensions.get('window').width;

    return <StyledInput
        width={width}
        placeholder={placeholder}
        maxLength={30}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType= "next"

        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        />
}
);

Input.propTypes={
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
};


const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const Header=styled.View`
    width: ${({width})=>width}px;
    height: 120px;
    background-color: ${({theme})=>theme.background};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    borderBottom-color: ${({theme})=>theme.appBackground};
    borderBottom-width: 3px;
    padding: 0;
`;


const MainHeader= ({clubname})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>

        <Text style={styles.clubname}>{clubname}</Text>

        </Header>
    )
};


const AllCon=styled.View`
  background-color: ${({ theme }) => theme.background};
  borderBottom-Width: 2.5px;
  borderBottom-Color: ${({ theme }) => theme.appBackground};
  width: ${({ width }) => (width)}px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  paddingRight: 10px;
  paddingBottom: 7px;
  marginBottom: 30px;
`;

const ContainerRow=styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.background};
`;

const Fix1=styled.View`
  width: ${({ width }) => (width)*0.22}px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  borderRight-Width: 1px;
  borderRight-Color: ${({ theme }) => theme.separator};

`;

const Fix2=styled.View`
  width: ${({ width }) => (width)*0.78}px;
`;

const ButtonFix2=styled.View`
  width: ${({ width }) => (width)}px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  marginTop: 50px;
  marginBottom: 50px;
  padding: 10px;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const Line=styled.View`
  background-color: ${({ theme }) => theme.appBackground};
  height: 0.8px;
  width: ${({ width }) => (width)}px;
`;

const styles = StyleSheet.create({
  First: {
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  Second:{
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  Img: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  clubname: {
    fontSize: 25,
    color: theme.text,
  },
});

const MyClubMainM=({ navigation, route })=>{
    const id = route.params.id;

    const width= Dimensions.get('window').width;

    const refintro=useRef();
    const refadmin=useRef();
    const refregion=useRef();
    const reftype=useRef();
    const refmaxnum=useRef();

    const [clubname, setClubname] = useState('');
    const [newIntro, setNewIntro]=useState('');
    const [admin, setAdmin]=useState('');
    const [newRegion, setNewRegion]=useState('');
    //const [newType, setNewType]=useState('');
    const [newMaxnum, setNewMaxnum]=useState('');
    const [leader, setLeader] = useState({});
    const [newLeader, setNewLeader] = useState({
      name: '',
      uid: ''
    });
    const [members, setMembers]=useState([{
      name: '',
      uid: ''}
    ]);
    const [oldLeader, setOldLeader] = useState({});

    const getClubData = async() => {
      try{
        const clubRef = DB.collection('clubs').doc(id);
        const clubDoc = await clubRef.get();
        const clubData = clubDoc.data();

        const leaderIndex = clubData.members.findIndex(member => member.uid === clubData.leader.uid);
        let temp = clubData.members[leaderIndex];
        clubData.members.splice(leaderIndex, 1);
        clubData.members.unshift(temp);

        console.log(clubData.members);

        setClubname(clubData.title);
        setAdmin(clubData.leader.name);
        setNewRegion(clubData.region);
        setNewMaxnum(clubData.maxNumber);
        setNewIntro(clubData.description);
        setMembers(clubData.members);
        setNewLeader(clubData.leader);
        setOldLeader(clubData.leader);

      }
      catch(e){
        Alert.alert("클럽 수신 데이터 오류", e.message);
      }
    }

    const renderMemberList = () => {
      return members.map((member) => {
        return <Picker.Item label = {member.name} value={member} />
      })
    }

    const _handleIntroChange = text => {
        setNewIntro(text);
    };

    const _handleMaxnumChange = text => {
        setNewMaxnum(text);
    };

    const _handelEditButtonPress = async() => {
      if(oldLeader.uid !== newLeader.uid) {
        Alert.alert("경고", `모임장을 ${newLeader.name}님으로 변경하시겠습니까?`,
        [
          {
            text: "아니요",
            style: "cancel"
          },
          {
            text: "예",
            onPress: async() => {
              try{
                const clubRef = DB.collection('clubs').doc(id);

                const tempLeader = {
                  email: newLeader.email,
                  name: newLeader.name,
                  photoUrl: newLeader.photoUrl,
                  uid: newLeader.uid
                }

                await DB.runTransaction(async (t) => {
                  t.update(clubRef, {description: newIntro, region: newRegion, maxNumber: newMaxnum, leader: tempLeader});
                });

                Alert.alert('클럽 정보 수정 완료');
                navigation.navigate('MyClubMainInfoNav', {screen:"MyClubMainManage", params:{id: id}});
              }
              catch (e) {
                Alert.alert('클럽 정보 수정 오류', e.message);
              }
            }
          }
        ]);
      }
      else {
        try{
          const clubRef = DB.collection('clubs').doc(id);

          const tempLeader = {
            email: newLeader.email,
            name: newLeader.name,
            photoUrl: newLeader.photoUrl,
            uid: newLeader.uid
          }

          await DB.runTransaction(async (t) => {
            t.update(clubRef, {description: newIntro, region: newRegion, maxNumber: newMaxnum, leader: tempLeader});
          });

          Alert.alert('클럽 정보 수정 완료');
          navigation.navigate('MyClubMainInfoNav', {screen:"MyClubMainManage", params:{id: id}});
        }
        catch (e) {
          Alert.alert('클럽 정보 수정 오류', e.message);
        }
      }
    }

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
            headerLeft: ({onPress, tintColor})=>{
                return(

                    <MaterialCommunityIcons
                        name="keyboard-backspace"
                        size={30}
                        style={{marginLeft:13}}
                        color={tintColor}
                        onPress={onPress}   //추후수정-뒤로가기
                    />
                );
            },
        });
        getClubData();
    }, []);


    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader clubname={clubname}></MainHeader>

        <List width={width}>
            <AllCon width={width}>
                <IntroInput
                    ref={refintro}
                    placeholder="새로운 소개글을 입력해주세요."
                    value={newIntro}
                    onChangeText={_handleIntroChange}
                    onSubmitEditing={()=>{}}
                />
              <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.Second}>관리자</Text>
                    </Fix1>
                    <Fix2 width={width}>
                    <Picker
                        selectedValue={newLeader}
                        style={{ height: 50, width: 200, margin: 10 }}
                        onValueChange={(itemValue, itemIndex) => setNewLeader(itemValue)}>
                        {renderMemberList()}
                    </Picker>
                    </Fix2>
                </ContainerRow>
                <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>지역구</Text>
                    </Fix1>
                    <Fix2 width={width}>
                    <Picker
                        selectedValue={newRegion}
                        style={{ height: 50, width: 200, margin: 10 }}
                        onValueChange={(itemValue, itemIndex) => setNewRegion(itemValue)}>
                        <Picker.Item label="지역을 선택해주세요" value="" />
                        <Picker.Item label="강서" value="강서" />
                        <Picker.Item label="강북" value="강북" />
                        <Picker.Item label="강남" value="강남" />
                        <Picker.Item label="강동" value="강동" />
                        <Picker.Item label="경기북부" value="경기북부" />
                        <Picker.Item label="경기남부" value="경기남부" />
                        <Picker.Item label="충청" value="충청" />
                        <Picker.Item label="전라" value="전라" />
                        <Picker.Item label="경북" value="경북" />
                        <Picker.Item label="경남" value="경남" />
                        <Picker.Item label="제주" value="제주" />
                    </Picker>
                    </Fix2>
                </ContainerRow>
                <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>최대인원</Text>
                    </Fix1>
                    <Fix2 width={width}>
                        <Input
                            ref={refmaxnum}
                            placeholder="새로운 최대인원을 입력해주세요."
                            value={newMaxnum}
                            onChangeText={_handleMaxnumChange}
                            onSubmitEditing={()=>{}}
                        />
                    </Fix2>
                </ContainerRow>

            </AllCon>

            <ButtonFix2 width={width}>
              <Button
                color= '#fac8af'
                title="정보 수정 완료"
                onPress={_handelEditButtonPress}    //수정 완료 함수 필요
              />
            </ButtonFix2>
        </List>
        </Container>
        </KeyboardAwareScrollView>

    );
};

// <ContainerRow width={width}>
//     <Fix1 width={width}>
//       <Text style={styles.First}>모임형태</Text>
//     </Fix1>
//     <Fix2 width={width}>
//         <Input
//             ref={reftype}
//             placeholder="새로운 모임형태를 입력해주세요."
//             value={newType}
//             onChangeText={_handleTypeChange}
//             onSubmitEditing={()=>refmaxnum.current.focus()}
//         />
//     </Fix2>
// </ContainerRow>
// <Line width={width}></Line>

export default MyClubMainM;
