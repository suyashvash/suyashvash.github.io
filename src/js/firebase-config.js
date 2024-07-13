// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCvmK7BjfppwcUsPpIpN7mnySbx36uTn3k",
  authDomain: "suyash-portfolio-b9bf5.firebaseapp.com",
  projectId: "suyash-portfolio-b9bf5",
  storageBucket: "suyash-portfolio-b9bf5.appspot.com",
  messagingSenderId: "902073852222",
  appId: "1:902073852222:web:edb832ce15f82147f9cc6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
export { db, collection, addDoc };

