//모임장만이 접근 가능한 클럽에 가입 요청한 대기자들의 리스트 조회 컴포넌트
//멤버의 프로필사진/닉네임/가입ID(이메일 형식의)을 조회 가능합니다.
//가입 승인, 가입 거부 기능을 실행할 수 있습니다.

import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList, Button, Image, Alert } from 'react-native';
import { theme } from '../theme';
import { DB } from '../utils/firebase';



const Container = styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const ContainerRow=styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const FixInfo = styled.View`
  width: ${({ width }) => (width)*0.3}px;
  min-height: 70px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  paddingRight: 15px;
`;

const FixInfo2 = styled.View`
  width: ${({ width }) => (width)*0.45}px;
  min-height: 70px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  borderRight-Width: 0.8px;
  borderRight-Color: ${({ theme }) => theme.separator};
  paddingRight: 15px;
`;

const ButtonFix = styled.View`
  width: ${({ width }) => (width)*0.125}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const WaitAdminList = ({onchange ,userInfo, clubId}) => {
    const width = Dimensions.get('window').width;

    const user = userInfo.userlist;

    const renderItem = ({ item, onPress }) => {

      const _handleApproveButtonPress = () => {
        Alert.alert("알림", `${item.user_name} 회원의 가입을 승인하시겠습니까?`,
        [
          {
            text: "아니요",
            style: "cancel"
          },
          {
            text: "예",
            onPress: async () => {
              try {
                const clubRef = DB.collection('clubs').doc(clubId);
                await DB.runTransaction(async (t) => {
                  const clubDoc = await t.get(clubRef);
                  const clubData = clubDoc.data();
                  const members = clubData.members;
                  const waiting = clubData.waiting;
                  let target = {};
                  let list = [];
                  for (const temp of waiting) {
                    if (item.id == temp.uid) {
                      target.uid = temp.uid;
                      target.email = temp.email;
                      target.photoUrl = temp.photoUrl;
                      target.now_page = 0;
                      target.name = temp.name;
                    }
                    else {
                      list.push(temp);
                    }
                  }
                  const new_waiting = list;
                  members.push(target);

                  t.update(clubRef, {members: members, waiting: new_waiting});
                });

                const userRef = DB.collection('users').doc(item.id);
                await DB.runTransaction(async (t) => {
                  const userDoc = await t.get(userRef);
                  const userData = userDoc.data();

                  const club = {};

                  for (let key in userData.club) {
                    if(key !== clubId) {
                        club[key] = userData.club[key];
                    }
                    else {
                      club[key] = true;
                    }
                  }

                  console.log(club);

                  t.update(userRef, {club: club});
                });
                onchange();
                Alert.alert(`${item.user_name}회원 승인 완료`);

              }
              catch(e) {
                Alert.alert("회원 가입 승인 오류", e.message);
              }
            }
          }
        ]);
      }

      const _handleCancleButtonPressed = () => {
        Alert.alert("알림", `${item.user_name} 회원의 가입을 거절하시겠습니까?`,
        [
          {
            text: "아니요",
            style: "cancel"
          },
          {
            text: "예",
            onPress: async () => {
              try {
                const clubRef = DB.collection('clubs').doc(clubId);
                await DB.runTransaction(async (t) => {
                  const clubDoc = await t.get(clubRef);
                  const clubData = clubDoc.data();

                  const waiting = clubData.waiting;
                  let target = {};
                  let list = [];
                  for (let temp of waiting) {
                    if (item.id != temp.uid) {
                      list.push(temp);
                    }
                  }
                  const new_waiting = list;

                  t.update(clubRef, {waiting: new_waiting});
                });

                const userRef = DB.collection('users').doc(item.id);
                await DB.runTransaction(async (t) => {
                  const userDoc = await t.get(userRef);
                  const userData = userDoc.data();

                  const club = {};

                  for (let key in userData.club) {
                    if(key !== clubId) {
                        club[key] = userData.club[key];
                    }
                  }

                  t.update(userRef, {club: club});
                });

                Alert.alert(`${item.user_name}회원 가입 거절 완료`);
                onchange();
              }
              catch(e) {
                Alert.alert("회원 가입 거절 오류", e.message);
              }

            }
          }
        ]);
      }

        return (
          <ContainerRow width={width}>
            <FixInfo width={width}>
                <Image
                    style={styles.profileimg}
                    source={{uri:item.img_url}} />
                <Text style={styles.username}>{item.user_name}</Text>
            </FixInfo>

            <FixInfo2 width={width}>
                <Text style={styles.usermail}>{item.user_mail}</Text>
            </FixInfo2>

            <ButtonFix width={width}>
                <Button
                    title="승인"
                    onPress={_handleApproveButtonPress}        
                    color= '#fac8af'
                />
            </ButtonFix>
            <ButtonFix width={width}>
                <Button
                    title="거절"
                    onPress={_handleCancleButtonPressed}       
                    color= '#fac8af'
                />
                </ButtonFix>
          </ContainerRow>
        );
    };
    return (
        <Container width={width}>
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={user}
            renderItem={renderItem}
            ItemSeparatorComponent={() => {
            return (
                <View style={styles.separator} />
            );
            }}
        />
        </Container>
    );
};

const styles = StyleSheet.create({
  username: {
    fontSize: 16,
    color: theme.text,
    paddingLeft: 20,
  },
  profileimg: {
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  usermail:{
    fontSize: 16,
    color: theme.text,
    paddingLeft: 30,
  },
  separator: {
    height: 1,
    backgroundColor: theme.separator,
  },
});

WaitAdminList.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default WaitAdminList;
