// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, 
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         updateProfile } from 'firebase/auth';
import { getFirestore,
         collection,
         addDoc,
         getDocs,
         query,
         where } from 'firebase/firestore';
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
const btnSetup = document.getElementById("setup-form-submit");


const profileUpdate = async () => {
  const displayName = setupForm.displayName.value;
  const photoURL = setupForm.photourl.value;

  try {
    const userInfo = await updateProfile(auth.currentUser, {displayName: displayName, photoURL: photoURL});
    const user = auth.currentUser;
    if (user) {
      const profileName = user.displayName;
      const profilePic = user.photoURL;
      const emailAddress = user.email;

      const profilePicHolder = document.getElementById("profile-pic");
      const displayNameHolder = document.getElementById("display-name");
      const emailHolder = document.getElementById("email-address")

      /*profilePicHolder.src = profilePic;*/
      displayNameHolder.textContent = "xxx";
      console.log(displayNameHolder.textContent)
      /*emailHolder.innerHTML = emailAddress;*/
      /*window.location.assign("./viewprofile.html");*/
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

const taskList = [];

try {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach((doc) => {
    const task = doc.get("task");
    taskList.push(task);
  })
}
catch(error) {
  console.log(error);
}

const holder = document.getElementById('all-task-box');
const fragment = document.createDocumentFragment();

var i = 0;

taskList.forEach(function(task) {
  i = i + 1;
  const taskHolder = document.createElement('div');
  taskHolder.id = 't'+i;
  taskHolder.className = 'grid-label';
  taskHolder.innerHTML = '<h4>'+task+'</h4>';
  fragment.appendChild(taskHolder);
})

holder.appendChild(fragment);

const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

const d = new Date();
let today = weekday[d.getDay()];

const dayDisplay = document.getElementById("today");
dayDisplay.innerHTML = '<h2>Today is '+today+'</h2>';

const q = query(collection(db, "tasks"), where(today, "==", "X"));

const todayList = [];

try {
  const todaySnapshot = await getDocs(q);
  todaySnapshot.forEach((doc) => {
    const task2 = doc.get("task");
    todayList.push(task2);
  });
}
catch(error) {
  console.log(error);
}

const todayTask = document.getElementById("todays-task-list");
const todayFragment = document.createDocumentFragment();
var i2 = 0;

todayList.forEach(function(task) {
  i2 = i2 + 1;
  const todayHolder = document.createElement('div');
  todayHolder.id = 'd'+i2;
  todayHolder.className = 'grid-label';
  todayHolder.innerHTML = '<h4>'+task+'</h4>';
  todayFragment.appendChild(todayHolder);
})

todayTask.appendChild(todayFragment);