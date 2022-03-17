# 독서 모임 모바일 어플리케이션 :: 서랍속책방
> 서울시립대학교 2021-1학기 컴퓨터과학종합설계 - 서랍 팀 </br>
 서랍속책방 (Mobile Application for Book Clubs)

</br>

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/55a9cd9a-7fff-4e14-9df7-6428b5f6be93/%EC%84%9C%EB%9E%8D%EC%86%8D%EC%B1%85%EB%B0%A9_%ED%8F%AC%EC%8A%A4%ED%84%B0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220317T055857Z&X-Amz-Expires=86400&X-Amz-Signature=87bb2a2f2dc5536263b08d7cadb9e6a99450e2ea99d9ae3ca0126fb964e7f2c1&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EC%2584%259C%25EB%259E%258D%25EC%2586%258D%25EC%25B1%2585%25EB%25B0%25A9_%25ED%258F%25AC%25EC%258A%25A4%25ED%2584%25B0.png%22&x-id=GetObject)

<br>

## 어플리케이션 소개
- 비대면 및 대면 독서 모임의 효과적인 운영을 위한 모바일 모임 어플리케이션이다.
- 모임원은 게시판과 앨범 기능을 이용하여 독서 모임의 자료들을 공유 및 관리할 수 있다.
- OCR 기능을 통해 인상 깊은 구절을 즉각적으로 추출할 수 있으며, 이를 이용하여 편리하게 에세이를 작성할 수 있다.
- 독서 진행 상황 공유 기능을 통해 모임원들의 동기를 부여할 수 있다.
- 일정 기능과 책 둘러보기 기능 등의 편의 기능을 제공한다.
- SNS 앱보다는 커뮤니티 앱을 기획하여 독서 모임에 최적화 된 기능을 제공한다.

<br>

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/daad8c67-4648-4f57-adeb-a6b5ca07e81a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220317T060227Z&X-Amz-Expires=86400&X-Amz-Signature=8f45eb0a4c04fc2dde99efd6787e374f476c84f3dd22a7bd42f54c66307d122c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

<br>

## 사용한 기술
- 프론트엔드 - React Native
- 서버 - Firebase
- API 제작 및 배포 - Python, Google Cloud Platform, Google Cloud Vision API, Amazon EC2

<br>

## 추후 구현할 사항
- 동적 푸시 알림 기능
- 누적된 모임별 데이터를 이용한 사용자 중심 책 추천 알고리즘
- 유저 커스텀 게시판 기능

<br>

## 저작권 관련 사항
- 로고 및 아이콘 - [Flaticon](https://www.flaticon.com/)
- 일러스트 - [Freepik](https://www.freepik.com)
- 폰트 - [리디바탕](https://www.ridicorp.com/ridibatang/)
- 책 등록하기 검색 기능 - [알라딘 검색 API](https://blog.aladin.co.kr/openapi/)
- 책 둘러보기 데이터 - [Yes24](http://www.yes24.com/)

<br>

## 구현한 API의 소스코드
- [OCR 후처리 API](https://github.com/seungri0826/bookclub-ocr-api) - Google Cloud Platform
- [책 둘러보기 API](https://github.com/seungri0826/bookclub-recommendation-api) - Amazon EC2

<br>

## 어플리케이션 설치 방법
- ~추후 [Google Play Store](https://play.google.com/store/apps/details?id=com.teamDrawer.bookclubInDrawer)에서 다운로드 가능~
- 서랍속책방은 현재 Google Play Store에서 게시 취소한 상태이다.

<br>

## 실행 시 필요한 파일
- `firebase.json` - Firebase Config 객체 선언
- `secret.js` - Google Cloud Vision API Key, 알라딘 검색 API Key 선언

<br><br>

<img src="./assets/splash.png" width="25%" height="25%">
