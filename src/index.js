// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, 
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         updateProfile } from 'firebase/auth';
import { getFirestore,
         collection,
         addDoc } from 'firebase/firestore';
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

console.log("Hello, firestore!");

const loginForm = document.getElementById("login-form")
const btnLogIn = document.getElementById("login-form-submit")
const btnSignUp = document.getElementById("signup-form-submit")

const createAccount = async () => {
  const loginEmail = loginForm.email.value;
  const loginPassword = loginForm.password.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userCredential.user);
    window.location.replace("./setupaccount.html")
  }
  catch(error) {
    console.log(error);
  }
}

if (btnSignUp) {
  btnSignUp.addEventListener("click", createAccount);
}

const logIntoAccount = async () => {
  const loginEmail = loginForm.email.value;
  const loginPassword = loginForm.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    window.location.replace("./employeehomepage.html")
  }
  catch(error) {
    console.log(error);
  }
}

if(btnLogIn) {
  btnLogIn.addEventListener("click", logIntoAccount);
}

const setupForm = document.getElementById("setup-form");
const btnSetup = document.getElementById("setup-form-submit")

const profileUpdate = async () => {
  const displayName = setupForm.displayName.value;
  const photoURL = setupForm.photourl.value;

  try {
    const userInfo = await updateProfile(auth.currentUser, {displayName: displayName, photoURL: photoURL});
    const user = auth.currentUser;
    if (user) {
      console.log("user is logged in");
      console.log(user);
    }
    else {
      console.log("user is NOT logged in");
    }
  }
  catch(error) {
    console.log(error);
  }
}

if(btnSetup) {
  btnSetup.addEventListener("click", profileUpdate);
}
