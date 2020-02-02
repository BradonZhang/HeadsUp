import firebase from 'firebase';
import 'firebase/firestore';
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB_is0Ir0_UdMCoRvmTb8q2D9yCnN3KIUI",
    authDomain: "headsup-42634.firebaseapp.com",
    databaseURL: "https://headsup-42634.firebaseio.com",
    projectId: "headsup-42634",
    storageBucket: "headsup-42634.appspot.com",
    messagingSenderId: "520139596940",
    appId: "1:520139596940:web:436dd8c28386d54fe947a9",
    measurementId: "G-LJHTMN5XQH"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const db = firebase.firestore();
  