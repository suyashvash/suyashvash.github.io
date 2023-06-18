import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyCOjqH6ZHtrPm1xXk7sdym3HlVFpB-pU6w",
  authDomain: "hire-form.firebaseapp.com",
  projectId: "hire-form",
  storageBucket: "hire-form.appspot.com",
  messagingSenderId: "109749983832",
  appId: "1:109749983832:web:5da20e63d07ea9f2a2c82d",
  measurementId: "G-QQFG6ZCXQ9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const projectFirestore = firebase.firestore();

export { projectFirestore };
