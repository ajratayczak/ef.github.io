// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
const btnSignUp = document.getElementById("signup-form-submit")

const createAccount = async () => {
  const loginEmail = loginForm.email.value;
  const loginPassword = loginForm.password.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userCredential.user);
  }
  catch(error) {
    console.log(error);
  }
}

btnSignUp.addEventListener("click", createAccount);

/*try {
  const docRef = await addDoc(collection(db, "employees"), {
    name: "Hailey Drager",
    schedule: {
      monday: {
        start: "7:00",
        end: "17:00"
      },
      tuesday: {
        start: "8:00",
        end: "16:00"
      },
      wednesday: {
        start: "8:00",
        end: "16:00"
      },
      thursday: {
        start: "7:00",
        end: "17:00"
      },
      friday: {
        start: "8:00",
        end: "17:00"
      }
    },
    supervisor: true
  });

  console.log("Document written with ID: ", docRef.id) ;
} catch (e) {
  console.error("Error adding document: ", e) ;
}*/