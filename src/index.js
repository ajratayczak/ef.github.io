// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgdf4JcZmOZ1frpApvZDxikLKa83GHY9o",
  authDomain: "ernessi-farms.firebaseapp.com",
  projectId: "ernessi-farms",
  storageBucket: "ernessi-farms.appspot.com",
  messagingSenderId: "20865077205",
  appId: "1:20865077205:web:1a735e66fd71d721f6375c",
  measurementId: "G-CX4Q875293"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Hello there, firestore!");
