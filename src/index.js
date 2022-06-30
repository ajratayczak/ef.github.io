// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, 
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         updateProfile,
         onAuthStateChanged } from 'firebase/auth';
import { getFirestore,
         collection,
         addDoc,
         getDocs,
         query,
         where,
         orderBy, 
         updateDoc,
         doc,
         getDoc,
         serverTimestamp} from 'firebase/firestore';
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

var uid;
var uemail;

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    uemail = user.email;
    console.log("User " + uid + " is signed in.");
  } else {
    // User is signed out
    console.log("No user is signed in.");
  }
});

const loginForm = document.getElementById("login-form")
const btnLogIn = document.getElementById("login-form-submit")

const logIntoAccount = async () => {
  const loginEmail = loginForm.email.value;
  const loginPassword = loginForm.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    window.location.replace("./supervisorhomepage.html")
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

/*Query all Tasks*/
/*const taskList = [];

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

holder.appendChild(fragment);*/

/*Task Queries by Dept*/
const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

const d = new Date();
let today = weekday[d.getDay()];

const dayDisplay = document.getElementById("today");
dayDisplay.innerHTML = '<h2>Today is '+today+'</h2>';

function convertTaskTime(time) {
  if (time == null) {
    const newTime = "undefined";
    return newTime;
  }
  else {
    if (time % 1 == 0){
      const newTime = time + ":00";
      return newTime;
    }
    else {
      const remainder = time % 1;
      const excessTime = remainder * 60;
      if (excessTime % 1 == 0) {
        const first = Math.floor(time);
        if (excessTime < 10) {
          const newTime = first + ":0" + excessTime;
          return newTime;
        }
        else {
          const newTime = first + ":" + excessTime;
          return newTime;
        }
      }
      else {
        if (excessTime < 10) {
          const secRemainder = excessTime % 1;
          const seconds = secRemainder * 60;
          const newSeconds = Math.floor(seconds);
          const minutes = Math.floor(excessTime);
          const first = Math.floor(time);
          if (newSeconds < 10) {
            const newTime = first + ":0" + minutes + ":0" + newSeconds;
            return newTime;
          }
          else {
            const newTime = first + ":0" + minutes + ":" + newSeconds;
            return newTime;
          }
        }
        else {
          const secRemainder = excessTime % 1;
          const seconds = secRemainder * 60;
          const newSeconds = Math.floor(seconds);
          const minutes = Math.floor(excessTime);
          const first = Math.floor(time);
          if (newSeconds < 10) {
            const newTime = first + ":" + minutes + ":0" + newSeconds;
            return newTime;
          }
          else {
            const newTime = first + ":" + minutes + ":" + newSeconds;
            return newTime;
          }
        }
      }
    }
  }
}

async function searchForTasks(myQuery, myList, table1) {
  try {
    const mySnapshot = await getDocs(myQuery);
    mySnapshot.forEach((doc) => {
      var innerList = [];
      var weekdayList = [];
      if (doc.get("extra") != null) {
      }
      else {
        const task = doc.get("task");
        innerList.push(task);
        if (doc.get("monday") != null) {
          weekdayList.push("Mon");
        }
        else {}
        if (doc.get("tuesday") != null) {
          weekdayList.push("Tue");
        }
        else {}
        if (doc.get("wednesday") != null) {
          weekdayList.push("Wed");
        }
        else {}
        if (doc.get("thursday") != null) {
          weekdayList.push("Thu");
        }
        else {}
        if (doc.get("friday") != null) {
          weekdayList.push("Fri");
        }
        else {}
        innerList.push(weekdayList);
        weekdayList = [];
        const time = doc.get("time");
        innerList.push(time);
        const staff = doc.get("staff");
        innerList.push(staff);
        const id = doc.id;
        innerList.push(id);
        myList.push(innerList);
        innerList = [];
      }
    });
  }
  catch(error) {
    console.log(error);
  }   

  //[["task name", ["Mon", "Tue"], "time", "# of staff"],]

  const myTask = document.getElementById(table1);
  const myFragment = document.createDocumentFragment();
  var i = 0;

  myList.forEach(function(task) {
    i = i + 1;
    const myHolder = document.createElement('div');
    myHolder.className = 'row';
    const tempList = task[0].split(" ");
    const listSeparator = ["="];
    const secListSeparator = ["="];
    const thiListSeparator = ["="];
    const fouListSeparator = ["="];
    const timeList = [];
    const convertedTime = task[2];
    timeList.push(convertedTime);
    const staffList = [];
    staffList.push(task[3]);
    const idList = [];
    idList.push(task[4]);
    const taskList = tempList.concat(listSeparator, task[1], secListSeparator, timeList, thiListSeparator, staffList, fouListSeparator, idList);
    var j = 0;
    var taskString = "";
    while (j < taskList.length) {
      taskString = taskString + taskList[j] + "_";
      j ++;
    }
    const testString = "</p><div class='yn' id='edit' onclick=editTask('"+taskString+"')>EDIT</div>";
    myHolder.innerHTML = "<p>"+task[0]+"</p><p>"+task[1]+"</p><p>"+convertedTime+"</p><p>"+task[3]+testString;
    myFragment.appendChild(myHolder);
  });

  myTask.appendChild(myFragment);
}

const mush = query(collection(db, "tasks"), where("dept", "==", "MUSH"));

const mushList = [];

searchForTasks(mush, mushList, "mush-task-table");


const hydro = query(collection(db, "tasks"), where("dept", "==", "HYDRO"));

const hydroList = [];

searchForTasks(hydro, hydroList, "hydro-task-table");


const clean = query(collection(db, "tasks"), where("dept", "==", "CLEAN"));

const cleanList = [];

searchForTasks(clean, cleanList, "clean-task-table");


const pro = query(collection(db, "tasks"), where("dept", "==", "PRO"));

const proList = [];

searchForTasks(pro, proList, "pro-task-table");


const admin = query(collection(db, "tasks"), where("dept", "==", "ADMIN"));

const adminList = [];

searchForTasks(admin, adminList, "admin-task-table");


const extra = query(collection(db, "tasks"), where("extra", "!=", null));

const xList = []

try {
  const mySnapshot = await getDocs(extra);
  mySnapshot.forEach((doc) => {
    var innerList = [];
    var weekdayList = [];
    const task = doc.get("task");
    innerList.push(task);
    if (doc.get("monday") != null) {
      weekdayList.push("Mon");
    }
    else {}
    if (doc.get("tuesday") != null) {
      weekdayList.push("Tue");
    }
    else {}
    if (doc.get("wednesday") != null) {
      weekdayList.push("Wed");
    }
    else {}
    if (doc.get("thursday") != null) {
      weekdayList.push("Thu");
    }
    else {}
    if (doc.get("friday") != null) {
      weekdayList.push("Fri");
    }
    else {}
    innerList.push(weekdayList);
    weekdayList = [];
    const time = doc.get("time");
    innerList.push(time);
    const staff = doc.get("staff");
    innerList.push(staff);
    xList.push(innerList);
    innerList = [];
  });
}
catch(error) {
  console.log(error);
}   

const xTask = document.getElementById("x-task-table");
const xFragment = document.createDocumentFragment();
var i = 0;

xList.forEach(function(task) {
  i = i + 1;
  const myHolder = document.createElement('div');
  myHolder.className = 'row';
  const tempList = task[0].split(" ");
  const listSeparator = ["="];
  const secListSeparator = ["="];
  const thiListSeparator = ["="];
  const timeList = [];
  const convertedTime = task[2];
  timeList.push(convertedTime);
  const staffList = [];
  staffList.push(task[3]);
  const taskList = tempList.concat(listSeparator, task[1], secListSeparator, timeList, thiListSeparator, staffList);
  var j = 0;
  var taskString = "";
  while (j < taskList.length) {
    taskString = taskString + taskList[j] + "_";
    j ++;
  }
  const testString = "</p><div class='yn' id='edit' onclick=editTask('"+taskString+"')>EDIT</div>";
  myHolder.innerHTML = "<p>"+task[0]+"</p><p>"+task[1]+"</p><p>"+convertedTime+"</p><p>"+task[3]+testString;
  xFragment.appendChild(myHolder);
});

xTask.appendChild(xFragment);



//Submit values from edit pop up
const editBtn = document.getElementById("edit-sub");

async function submitEdits() {
  const taskName = document.getElementById("task-name").textContent;
  const possibleWeekdays = ["mon", "tue", "wed", "thu", "fri"];
  var updatedWeekdayList = [];
  possibleWeekdays.forEach((id) => {
    var elem = document.getElementById(id);
    var style = window.getComputedStyle(elem);
    var color = style.backgroundColor;
    if (color == "rgb(123, 193, 67)") {
      updatedWeekdayList.push(id);
    }
  });
  const taskTime = document.getElementById("task-time").textContent;
  const possibleStaff = ["one", "two", "three", "four", "five", "six", "undef"];
  var updatedStaff = 0;
  possibleStaff.forEach((id) => {
    var elem = document.getElementById(id);
    var style = window.getComputedStyle(elem);
    var color = style.backgroundColor;
    if (color == "rgb(123, 193, 67)") {
      if (id == "one") {
        updatedStaff = 1;
      }
      else {}
      if (id == "two") {
        updatedStaff = 2;
      }
      else {}
      if (id == "three") {
        updatedStaff = 3;
      }
      else {}
      if (id == "four") {
        updatedStaff = 4;
      }
      else {}
      if (id == "five") {
        updatedStaff = 5;
      }
      else {}
      if (id == "six") {
        updatedStaff = 6;
      }
      else {}
      if (id == "undef") {
        updatedStaff = "UNDEFINED";
      }
      else {}
    }
    else {}
  });

  var newTaskTotal = "";

  if (updatedStaff == "UNDEFINED") {
    newTaskTotal = taskTime;
  }
  else {
    var taskTimeList = taskTime.split(":");
    if (taskTimeList[0] != "0" && taskTimeList[0] != "00") {
      var taskTime0 = parseInt(taskTimeList[0]) * updatedStaff;
      var taskTime0 = taskTime0.toString();
    }
    else {
      var taskTime0 = taskTimeList[0];
    }
    if (taskTimeList[1] != "00") {
      var taskTime1 = parseInt(taskTimeList[1]) * updatedStaff;
      var taskTime1 = taskTime1.toString();
    }
    else {
      var taskTime1 = taskTimeList[1];
    }
    if (taskTimeList[2] !== undefined) {
      var taskTime2 = parseInt(taskTimeList[2]) * updatedStaff;
      var taskTime2 = taskTime2.toString();
      console.log(taskTime2);
      newTaskTotal = taskTime0 + ":" + taskTime1 + ":" + taskTime2;
    }
    else {
      newTaskTotal = taskTime0 + ":" + taskTime1;
    }
  }

  const taskID = document.getElementById("id-holder").textContent;

  var originalWeekdays = [];

  var originalStaff = '';
  var originalTime = '';
  var originalTotal = '';
  var originalWeekdayList = [];

  try{
    const docRef = doc(db, "tasks", taskID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      originalStaff = docSnap.get("staff");
      originalTime = docSnap.get("time");
      originalTotal = docSnap.get("total");
      if (docSnap.get("monday") != null) {
        originalWeekdayList.push("mon");
      }
      else {}
      if (docSnap.get("tuesday") != null) {
        originalWeekdayList.push("tue");
      }
      else {}
      if (docSnap.get("wednesday") != null) {
        originalWeekdayList.push("wed");
      }
      else {}
      if (docSnap.get("thursday") != null) {
        originalWeekdayList.push("thu");
      }
      else {}
      if (docSnap.get("friday") != null) {
        originalWeekdayList.push("fri");
      }
      else {}
    } else {
      console.log("No such document!");
    }
  }
  catch(error){
    console.log(error);
  }

  try {
    const editRef = await addDoc(collection(db, "tasks", taskID, "edits"), {
      task: taskName,
      timestamp: serverTimestamp(),
      ogStaff: originalStaff,
      ogTime: originalTime,
      ogTotal: originalTotal,
      newStaff: updatedStaff,
      newTime: taskTime,
      newTotal: newTaskTotal,
      editor: uemail,
      newWeekdayList: updatedWeekdayList,
      ogWeekdayList: originalWeekdayList
    });

    console.log("Edit added to database!");
  }
  catch(error){
    console.log(error);
  }

  const pageEditRef = doc(db, "tasks", taskID);

  try {
    await updateDoc(pageEditRef, {
      staff: updatedStaff,
      time: taskTime,
      total: newTaskTotal
    });
  }
  catch(error) {
    console.log(error);
  }
}

if(editBtn) {
  editBtn.addEventListener("click", submitEdits);
}


/*Query Employees for Working Currently*/
let hour = d.getHours();

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalizedToday = capitalizeFirstLetter(today);

//Update employee working times
/*const employeeIDList = [];

try {
  const employeeSnapshot = await getDocs(collection(db, "employees"));
  employeeSnapshot.forEach((doc) => {
    const id = doc.id; 
    employeeIDList.push(id);
  });
}
catch(error) {
  console.log(error);
}

employeeIDList.forEach(async function(id) {
  const employeeRef = doc(db, "employees", id);

  try {
    const employeeSnap = await getDoc(employeeRef);

    if (employeeSnap.exists()) {
      const mStart = employeeSnap.get("Monday-start");
      const mFinish = employeeSnap.get("Monday-finish");
      const tStart = employeeSnap.get("Tuesday-start");
      const tFinish = employeeSnap.get("Tuesday-finish");
      const wStart = employeeSnap.get("Wednesday-start");
      const wFinish = employeeSnap.get("Wednesday-finish");
      const rStart = employeeSnap.get("Thursday-start");
      const rFinish = employeeSnap.get("Thursday-finish");
      const fStart = employeeSnap.get("Friday-start");
      const fFinish = employeeSnap.get("Friday-finish");

      convertTimes(mStart, mFinish, "Monday-start", "Monday-finish", employeeRef);
      convertTimes(tStart, tFinish, "Tuesday-start", "Tuesday-finish", employeeRef);
      convertTimes(wStart, wFinish, "Wednesday-start", "Wednesday-finish", employeeRef);
      convertTimes(rStart, rFinish, "Thursday-start", "Thursday-finish", employeeRef);
      convertTimes(fStart, fFinish, "Friday-start", "Friday-finish", employeeRef);
    } else {
      console.log("No such document!");
    }
  }catch(error) {
    console.log(error);
  }
});

async function convertTimes(start, finish, field1, field2, empRef) {
  var newStart = 0;
  var newFinish = 0;
  if (start != null && finish != null) {
    if (start.includes("AM") && finish.includes("PM")) {
      const startArr = start.split(":");
      newStart = parseInt(startArr[0]);

      const finishArr = finish.split(":");
      const newFinishp1 = parseInt(finishArr[0]);
        if (newFinishp1 == 12) {
          newFinish = 12;
        }
        else {
          newFinish = newFinishp1 + 12;
        }
    }
    else if (start.includes("AM") && finish.includes("AM")) {
      const startArr = start.split(":");
      newStart = parseInt(startArr[0]);

      const finishArr = finish.split(":");
      newFinish = parseInt(finishArr[0]);
    }
    else {
      const startArr = start.split(":");
      const newStartp1 = parseInt(startArr[0]);
        if (newStartp1 == 12) {
          newStart = 12;
        }
        else {
          newStart = newStartp1 + 12;
        }

      const finishArr = finish.split(":");
      const newFinishp1 = parseInt(finishArr[0]);
        if (newFinishp1 == 12) {
          newFinish = 12;
        }
        else {
          newFinish = newFinishp1 + 12;
        }
    }

    try {
      await updateDoc(empRef, {
        [field1]: newStart,
        [field2]: newFinish
      });
    }
    catch(error) {
      console.log(error)
    }
  }
  else {

  }
}*/

/*const todaysEmployees = query(collection(db, "employees"), where(capitalizedToday+"-start", ">=", "11:00 AM"));

const todaysEmployeeList = [];

try {
  const todayEmployeeSnapshot = await getDocs(todaysEmployees);
  todayEmployeeSnapshot.forEach((doc) => {
    const start = doc.get(capitalizedToday+"-start");
    todaysEmployeeList.push(start);
  });
}
catch(error) {
  console.log(error);
}

console.log(todaysEmployeeList);*/

/*if (pm == false) {
  const todaysEmployees = query(collection(db, "employees"), where(capitalizedToday+"-start", "<=", currentTime));
}
else {
  if(currentTime == "12:00 PM") {
    const todaysEmployees = query(collection(db, "employees"), where(capitalizedToday+"-start", ""))
  }
  else {
    const todaysEmployees = query(collection(db, "employees"), where(capitalizedToday+"-start"))
  }
}*/


//Convert task times and totals
/*const taskIDList = [];

try {
  const taskSnapshot = await getDocs(collection(db, "tasks"));
  taskSnapshot.forEach((doc) => {
    const id = doc.id; 
    taskIDList.push(id);
  });
}
catch(error) {
  console.log(error);
}

taskIDList.forEach(async function(id) {
  const taskRef = doc(db, "tasks", id);

  try {
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const origTime = taskSnap.get("time")
      const origTotal = taskSnap.get("total")
      
      convertTaskTimes(origTime, origTotal, taskRef);
      console.log("complete");
    } else {
      console.log("No such document!");
    }
  }catch(error) {
    console.log(error);
  }
});

async function convertTaskTimes(ogTime, ogTotal, taskRef) {
  const convertedTime = convertTaskTime(ogTime);
  const convertedTotal = convertTaskTime(ogTotal);

  try {
    await updateDoc(taskRef, {
      time: convertedTime,
      total: convertedTotal
    });
  }
  catch(error) {
    console.log(error)
  }
}*/
