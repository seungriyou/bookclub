import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList, Button, Image, Alert } from 'react-native';
import { theme } from '../theme';
import { DB, getCurrentUser } from '../utils/firebase';



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
  width: ${({ width }) => (width)*0.5}px;
  min-height: 70px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  borderRight-Width: 0.8px;
  borderRight-Color: ${({ theme }) => theme.separator};
  paddingRight: 15px;
`;

const ButtonFix = styled.View`
  width: ${({ width }) => (width)*0.2}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const UserAdminList = ({onchange, userInfo, clubId}) => {
    const width = Dimensions.get('window').width;
    const user = userInfo.userlist;

    const renderItem = ({ item, onPress }) => {
        const _handleUserDeleteButton = async() => {
          Alert.alert("경고", `${item.user_name} 회원을 강퇴시키겠습니까?`,
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
                    let list = [];

                    for(const member of members) {
                      if (member.uid != item.id) {
                        list.push(member);
                      }
                    }

                    t.update(clubRef, {members: list});
                  });

                  const userRef = DB.collection('users').doc(item.id);
                  await DB.runTransaction(async (t) => {
                    const userDoc = await t.get(userRef);
                    const userData = userDoc.data();

                    const club = {};

                    for (let key in userData.club) {
                      if(key !== clubId) {
                          club[key] = userData.club[key]
                      }
                    }

                    t.update(userRef, {club: club});
                  });
                  onchange();
                  Alert.alert(`${item.user_name}회원 강퇴 완료`);

                }
                catch(e) {
                  Alert.alert("회원 삭제 오류", e.message);
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
                    title="강퇴"
                    onPress={_handleUserDeleteButton}        //강제 탈퇴 함수가 필요합니다.
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

UserAdminList.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default UserAdminList;
