import React, { useState, useEffect, useLayoutEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import AlbumTitleInput from '../components/AlbumTitleInput';
import AlbumContentInput from '../components/AlbumContentInput';

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.appBackground};
    align-items: center;
    justify-content: flex-start;
`;

const AlbumWrite = ({ navigation, route }) => {
    const [title, setTitle] = useState('');
    const [photos, setPhotos] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (route.params.photos) {
            setPhotos(route.params.photos);
            console.log(route.params.photos);   // 사진 uri 정보를 배열로 출력함
        }
    }, [route.params.photos]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <MaterialIcons
                    name="check"
                    size={30}
                    style={{ marginRight: 13 }}
                    color={theme.buttonIcon}
                    onPress={_handleCompleteButtonPress}
                />
            ),
        });
    }, [title, content, photos]);

    const _handleTitleChange = text => {
        setTitle(text);
    };

    const _handleContentChange = text => {
        setContent(text);
    };

    // DB와 연결할 부분. 현재는 console 출력으로 대체함
    const _handleCompleteButtonPress = async () => {
        if (photos == '' || title == '') {
            alert(`제목 또는 사진이 없습니다.`);
        }
        else {
            console.log(`Title: ${title}`);
            console.log(`Photo: ${photos}`);
            console.log(`Content: ${content}`);
            alert(`등록되었습니다.`);
            setPhotos([]);
            setTitle('');
            setContent('');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <AlbumTitleInput
                    placeholder="제목"
                    value={title}
                    onChangeText={_handleTitleChange}
                />
                <AlbumContentInput
                    onPress={() => navigation.navigate('MyClubAlbumSelectPhoto')}
                    photos={photos}
                    text={content}
                    onChangeText={_handleContentChange}
                />
            </Container>
        </ThemeProvider>
    );
};

export default AlbumWrite;
