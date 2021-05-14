import firebase from 'firebase';
import config from '../../firebase.json';
import 'firebase/firestore';


const app = firebase.initializeApp(config);
export const Storage = app.storage();

const Auth = app.auth();

const uploadImage = async uri => { //프로필 이미지를 파이어 베이스 스토리지에 업로드 하는 함수
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError('네트워크 요청 실패'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const user = Auth.currentUser;
  const ref = app.storage().ref(`/profile/${user.uid}/photo.png`);
  const snapshot = await ref.put(blob, { contentType: 'image/png' });

  blob.close();
  return await snapshot.ref.getDownloadURL();
};

export const login = async ({ email, password }) => { //파이어베이스로 로그인하는 함수
  const {user} = await Auth.signInWithEmailAndPassword(email, password);
  return user;
};

export const DB = firebase.firestore();

export const signup = async ({ email, password, name, photoUrl }) => { //파이어베이스로 회원가입을 진행하는 함수
  const { user } = await Auth.createUserWithEmailAndPassword(email, password);
  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl);
  await user.updateProfile({
    displayName: name,
    photoURL: storageUrl,
  });

  newUserRef = DB.collection('users').doc(user.uid);
  newUser = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    club: {}
  }

  await newUserRef.set(newUser);

  return user;
};

export const logout = async () => {
  return await Auth.signOut();
}

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = Auth.currentUser;
  return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserPhoto = async photoUrl => {
  const user = Auth.currentUser;
  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl);
  await user.updateProfile({ photoURL: storageUrl });
  return { name: user.displayName, email: user.email, photoUrl: user.photoURL };
};

export const createClub = async ({ title, description, leader, region, maxNumber }) => {
  const user = Auth.currentUser;
  const newClubRef = DB.collection('clubs').doc();
  const id = newClubRef.id;
  const members = [];
  const member = {
    uid: leader.uid,
    isWaiting: false,
  };
  members.push(member);
  const newClub = {
    id,
    title,
    description,
    leader,
    region,
    maxNumber,
    members,
    createAt: Date.now(),
  };
  await newClubRef.set(newClub);

  await newClubRef
        .collection('bookCompleted');

  await newClubRef
        .collection('bookOngoing');

  const userRef = DB.collection('users').doc(user.uid);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const club = userData.club;
  club[id] = false

  userRef.update({club: club});

  return id;
}

export const getClubInfo = async (id) => {
  const clubRef = await DB.collection('clubs').doc(id).get();
  const data = clubRef.data();
  return { title: data.title, leader: data.leader, members: data.members,region: data.region, maxNumber: data.maxNumber, description: data.description }
}

export const clubSignUpWaiting = async (clubId) => {
  const user = Auth.currentUser;
  const clubRef = DB.collection('clubs').doc(clubId);
  const clubDoc = await clubRef.get();
  const clubData = clubDoc.data();

  const userRef = DB.collection('users').doc(user.uid);
  const userDoc = await userRef.get();
  const userData = userDoc.data();

  const members = clubData.members;
  members.push({
    name: userData.name,
    photoUrl: userData.photoUrl,
    uid: userData.uid,
    now_page: 0,
  });

  clubRef.update({members: members}).then(res => {
    console.log(members);
  });

  const club = userData.club;
  club[clubId] = true;

  userRef.update({club: club});

  return true;
}
