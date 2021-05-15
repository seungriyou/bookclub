import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, FlatList, Button, Image } from 'react-native';
import { theme } from '../theme';



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

const UserAdminList = ({userInfo}) => {
    const width = Dimensions.get('window').width;

    const user = userInfo.userlist;

    const renderItem = ({ item, onPress }) => {
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
                    onPress={()=>alert('강퇴 함수 필요. 강퇴시키겠습니까?')}        //강제 탈퇴 함수가 필요합니다.
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