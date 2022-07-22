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
         serverTimestamp,
         deleteField} from 'firebase/firestore';
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

//Harvest Report
const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

//Uses a date object to find what day it is today
const d = new Date();
let today = weekday[d.getDay()];

const capitalizedToday = capitalizeFirstLetter(today);

const todayStart = capitalizedToday + "-start";
const todayFinish = capitalizedToday + "-finish";
//Will need to add configuration to check if employee is actually working at current moment

var todayEmpName;
var w = 0;
var checkBoxDisplay = "";

const todaysEmployees = query(collection(db, "employees"), orderBy(todayStart));

try{
  const todayEmpSnapshot = await getDocs(todaysEmployees);
  todayEmpSnapshot.forEach((doc) => {
    //Get name of each employee working today
    todayEmpName = doc.get("name"); 
    //Create checkbox div for each employee
    //The value of the checkbox is the employee name
    checkBoxDisplay += "<div class='checkbox-holder'><input type='checkbox' id='cb"+w+"' name='checkBox"+w+"' value='"+todayEmpName+"'><label class='checkbox-label' for='checkBox"+w+"'> "+todayEmpName+"</label></div>";
    w ++;
  });
}
catch(error) {
  console.log(error);
}

//Add four extra input checkbox divs to group of employee checkboxes
for(let i = w+1; i<w+5; i++) {
  checkBoxDisplay += "<div class='checkbox-holder'><input type='checkbox' id='cb"+i+"' name='checkBox"+i+"' value='empty'><label class='checkbox-label' for='checkBox"+i+"'><input type='text' id='emp-input"+i+"' name='empInput"+i+"' class='emp-entry'></label></div>"
}

//This is the div that contains all the employee checkbox divs
const todayStaffHolder = document.getElementById("today-staff-holder");

if(todayStaffHolder) {
  todayStaffHolder.innerHTML = checkBoxDisplay;
}

function highlight(id, id2) {
  var elem = document.getElementById(id);
  var style = window.getComputedStyle(elem);
  var color = style.backgroundColor;
  if (color == "rgb(123, 193, 67)") {
    document.getElementById(id).style.backgroundColor = "rgb(247, 248, 243)";
    document.getElementById(id2).style.backgroundColor = "rgb(123, 193, 67)";
  }
  else if (color == "rgb(247, 248, 243)") {
    document.getElementById(id).style.backgroundColor = "rgb(123, 193, 67)";
    document.getElementById(id2).style.backgroundColor = "rgb(247, 248, 243)";
  }
}

var cropHolder;
const holderDisplay = document.getElementById("holder-display");
const runLevelHolder = document.getElementById("run-level-holder");

const rslYN = "<div class='med-yn' id='rsl-y'>YES</div><div class='med-yn' id='rsl-n'>NO</div>";

const cropSelector = document.getElementById("crop-selector");
if(cropSelector) {
  cropSelector.addEventListener(
    'change',
    async function() {
      var option = cropSelector.value;
      var transplantedCrops;

      if(option == "nothing") {
        holderDisplay.textContent = "holders: "
        runLevelHolder.innerHTML = "<label id='run-slash-level'><b>RUN/LEVEL FINISHED? </b></label>" + rslYN;
        const rslYHolder = document.getElementById("rsl-y");
        const rslNHolder = document.getElementById("rsl-n");
        rslYHolder.addEventListener("click", () => {highlight("rsl-y", "rsl-n")});
        rslNHolder.addEventListener("click", () => {highlight("rsl-n", "rsl-y")});
      }
      else {
        transplantedCrops = query(collection(db, "crops"), where("crop", "==", option));
      }

      try {
        const cropSnapshot = await getDocs(transplantedCrops);
        cropSnapshot.forEach((doc) => {
          cropHolder = doc.get("holder");
          cropHolder += "s: ";
          if(cropHolder == "trays: ") {
            runLevelHolder.innerHTML = "<label id='run-slash-level'><b>RUN FINISHED? </b></label>" + rslYN;
            const rslYHolder = document.getElementById("rsl-y");
            const rslNHolder = document.getElementById("rsl-n");
            rslYHolder.addEventListener("click", () => {highlight("rsl-y", "rsl-n")});
            rslNHolder.addEventListener("click", () => {highlight("rsl-n", "rsl-y")});
          }
          else {
            runLevelHolder.innerHTML = "<label id='run-slash-level'><b>LEVEL FINISHED? </b></label>"+rslYN+"<br><br><label><b>LEVEL: </b></label>";
            const rslYHolder = document.getElementById("rsl-y");
            const rslNHolder = document.getElementById("rsl-n");
            rslYHolder.addEventListener("click", () => {highlight("rsl-y", "rsl-n")});
            rslNHolder.addEventListener("click", () => {highlight("rsl-n", "rsl-y")});
          }
          holderDisplay.textContent = cropHolder;
        });
      }
      catch(error) {
        console.log(error);
      }
    },
    false
  );
}

/*Staff Duties Tab*/
var tomorrow;

//Calculates the next day of the work week
if (today == "friday") {
  tomorrow = weekday[1];
}
else if (today == "saturday") {
  tomorrow = weekday[1];
}
else {
  tomorrow = weekday[d.getDay() + 1];
}

//Displays the next day of the work week
const tomorrowDisplay = document.getElementById("tomorrows-tasks");
if (tomorrowDisplay) {
  tomorrowDisplay.textContent = tomorrow + "'S TASKS";
}

//Builds weekday fields to match those in the employee documents
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalizedTomorrow = capitalizeFirstLetter(tomorrow);

const tomorrowStart = capitalizedTomorrow + "-start";
const tomorrowFinish = capitalizedTomorrow + "-finish";

//Queries employees collection for employees who work on the next day of the work week
var tomEmpList = [];
const tomorrowsEmployees = query(collection(db, "employees"), orderBy(tomorrowStart));

//For each found employee, grabs name and calculates working hours for that day
try{
  const tomorrowEmpSnapshot = await getDocs(tomorrowsEmployees);
  tomorrowEmpSnapshot.forEach((doc) => {
    var innerList = [];
    const empName = doc.get("name");
    innerList.push(empName);
    const empStart = doc.get(tomorrowStart);
    const empFinish = doc.get(tomorrowFinish);
    const hrsAvailable = empFinish-empStart;
    innerList.push(hrsAvailable);
    tomEmpList.push(innerList);
  });
}
catch(error){
  console.log(error);
}

//Displays employees working "tomorrow" and displays their total working hours
const tomEmpTable = document.getElementById("staff-names");
const tomEmpFragment = document.createDocumentFragment();

//These lists allow for employees to be indexed
var empNameList = ["Select Employee"];
var empHourList = [];
var empIDList = ["Employee ID"];
var empAssignedHours = [];
var q = 0;

tomEmpList.forEach(function(emp) {
  const tomEmpHolder = document.createElement("div");
  tomEmpHolder.className = "emp-holder";
  tomEmpHolder.innerHTML = "<p>"+emp[0]+"</p><p class='emp-hour-holders' id='emp-hour-holder-"+q+"'>"+emp[1]+" hours</p>";
  //Adds the name of every working employee to list for option tag creation
  empNameList.push(emp[0]);
  //console.log(emp[0] + ": " + q);
  empIDList.push(q);
  tomEmpFragment.appendChild(tomEmpHolder);
  q ++;
});

if (tomEmpTable) {
  tomEmpTable.appendChild(tomEmpFragment);
}

//For each employee found in query, grabs how many hours they work tomorrow and their index
for(let i=0; i<q; i++) {
  var empHourHolderID = "emp-hour-holder-" + i;
  var empHourHolder = document.getElementById(empHourHolderID);
  if(empHourHolder) {
    var hoursTotal = empHourHolder.textContent;
    hoursTotal = hoursTotal.split(" ");
    hoursTotal = hoursTotal[0];
    empHourList.push(hoursTotal);
    empAssignedHours.push(0);
  }
}

//For each employee working "tomorrow", adds an option tag to a list
var empOption;
var selectList = [];

var selectString1;

for(let i=0; i < empNameList.length; i++) {
  //Value of option is employee hours
  //Text of option is employee name
  //console.log(empNameList[i] + ": " + empIDList[i]);
  empOption = "<option value='" + empIDList[i] + "'>" + empNameList[i] + "</option>";
  selectString1 += empOption;
}

selectString1 += "</select>";

//Queries db for tasks that occur "tomorrow"
var tomTaskList = [];

const tomorrowsTasks = query(collection(db, "tasks"), where(tomorrow, "==", "X"), orderBy("time", "desc"));

//For each found task, grabs task name, number of staff required, and time per employee
try{
  const tomorrowTaskSnapshot = await getDocs(tomorrowsTasks);
  tomorrowTaskSnapshot.forEach((doc) => {
    var innerList = [];
    const tomTask = doc.get("task");
    const tomStaff = doc.get("staff");
    const tomTime = doc.get("time");
    if(tomTime == "undefined") {
    }
    else {
    for(let i=0; i<tomStaff; i++) {
      innerList.push(tomTask);
      innerList.push(tomTime);
      tomTaskList.push(innerList);
      innerList = [];
    }
    }
  });
}
catch(error){
  console.log(error);
}

//Displays found tasks and related information on Supervisor Homepage
const tomTable = document.getElementById("staff-task-table");
const tomFragment = document.createDocumentFragment();
var x = 0;

tomTaskList.forEach(function(task) {
  const tomHolder = document.createElement("div");
  tomHolder.className = "staff-task-row";
  //Builds row including task name, time per employee, and select box of employees working tomorrow
  tomHolder.innerHTML = "<p>"+task[0]+"</p><p id='hour"+x+"'>"+task[1]+"</p><select id='select"+x+"'>"+selectString1;
  tomFragment.appendChild(tomHolder);
  x ++;
});

if (tomTable) {
  tomTable.appendChild(tomFragment);
}

const refreshBtn = document.getElementById("refresh-button");

if(refreshBtn) {
  refreshBtn.addEventListener("click", refreshMe);
}

function refreshMe() {
  //Goes through each task row
  for(let i=0; i<empAssignedHours.length; i++) {
    if(typeof empAssignedHours[i] === 'undefined') {
    }
    else {
      empAssignedHours[i] = 0;
    }
  }
  for(i=0; i<x; i++) {
    var selectID = "select" + i
    var selectBox = document.getElementById(selectID);
    if(selectBox) {
      var idNum = selectBox.value;
      var empName = selectBox.options[selectBox.selectedIndex].text
      //console.log(empName + ": " + idNum);
    }
    //Grabs how many hours it takes to complete task from row
    var hourID = "hour" + i;
    var hoursNeeded = document.getElementById(hourID);
    if(hoursNeeded) {
      var hourValue = hoursNeeded.textContent;
      hourValue = hourValue.split(":");
      if(hourValue[1] == "00") {
        var hoursSpent = hourValue[0];
        if(typeof empAssignedHours[idNum] === 'undefined') {
        }
        else {
          if(checkIfStringHasOnlyDigitsAndDecimal(empAssignedHours[idNum]) == true) {
            empAssignedHours[idNum] = parseFloat(empAssignedHours[idNum]);
            empAssignedHours[idNum] += parseInt(hoursSpent);
          }
          else {
            console.log("this is an error");
          }
        }
      }
      else {
        var minutesSpent = hourValue[1];
        var hoursSpent = hourValue[0];
        var minuteDecimal = minutesSpent / 60;
        var minuteDecimal = Math.round((minuteDecimal + Number.EPSILON) * 100) / 100;
        hoursSpent = parseInt(hoursSpent) + minuteDecimal;
        if(typeof empAssignedHours[idNum] === 'undefined') {
        }
        else {
          if(checkIfStringHasOnlyDigitsAndDecimal(empAssignedHours[idNum]) == true) {
            empAssignedHours[idNum] = parseFloat(empAssignedHours[idNum]);
            empAssignedHours[idNum] += parseFloat(hoursSpent);
          }
          else {
            console.log("this is an error");
          }
        }
      }
    }
    //console.log(empAssignedHours[idNum]);
  }
  //console.log(empAssignedHours);
  //console.log(empIDList);
  for(let i=0; i<empAssignedHours.length; i++) {
    var hoursLeft = empHourList[i] - empAssignedHours[i];
    var idNum = empIDList[i+1];
    var holderIDString = "emp-hour-holder-" + idNum;
    var holderObj = document.getElementById(holderIDString);
    if(holderObj) {
      if(hoursLeft <= 1) {
        holderObj.style.color = "#D67C0F";
        holderObj.textContent = hoursLeft + " hour";
      }
      else if(hoursLeft <= 0) {
        holderObj.style.color = "#D60F0F";
        holderObj.textContent = hoursLeft + " hours";
      }
      else {
        holderObj.style.color = "#0C8E26";
        holderObj.textContent = hoursLeft + " hours";
      }
    }
  }
}


/*Task Queries by Dept*/
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

  if (myTask) {
    myTask.appendChild(myFragment);
  }
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
    const id = doc.id;
    innerList.push(id);
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
  myHolder.className = 'long-row';
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
  const testString = "</p><div class='yn' id='edit2' onclick=editTask('"+taskString+"')>EDIT</div><div class='yn' id='del'>DELETE</div>";
  myHolder.innerHTML = "<p>"+task[0]+"</p><p>"+task[1]+"</p><p>"+convertedTime+"</p><p>"+task[3]+testString;
  xFragment.appendChild(myHolder);
});

if (xTask) {
  xTask.appendChild(xFragment);
}


//Delete extra task function
/*var thisID;

const delBtn = document.getElementById("del");
if(document.getElementById("id-holder")) {
  thisID = document.getElementById("id-holder").textContent;
}

async function deleteXTask(id) {
  console.log(id);
}

if (delBtn) {
  delBtn.addEventListener("click", deleteXTask(thisID));
}*/



//Submit values from edit pop up
const editBtn = document.getElementById("edit-sub");

async function submitEdits() {
  const taskName = document.getElementById("task-name").textContent;
  const possibleWeekdays = ["mon", "tue", "wed", "thu", "fri"];
  var updatedWeekdayList = [];
  var notWeekdayList = [];
  possibleWeekdays.forEach((id) => {
    var elem = document.getElementById(id);
    var style = window.getComputedStyle(elem);
    var color = style.backgroundColor;
    if (color == "rgb(123, 193, 67)") {
      updatedWeekdayList.push(id);
    }
    else {
      notWeekdayList.push(id);
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

    alert("Edit added to database!");
  }
  catch(error){
    console.log(error);
  }

  const pageEditRef = doc(db, "tasks", taskID);

  try {
    await updateDoc(pageEditRef, {
      staff: updatedStaff,
      time: taskTime,
      total: newTaskTotal,
      monday: "X",
      tuesday: "X",
      wednesday: "X",
      thursday: "X",
      friday: "X"
    });
  }
  catch(error) {
    console.log(error);
  }

  if (notWeekdayList.includes("mon")) {
    try {
      await updateDoc(pageEditRef, {
        monday: deleteField()
      });
    }
    catch(error) {
      console.log(error);
    }
  }
  if (notWeekdayList.includes("tue")) {
    try {
      await updateDoc(pageEditRef, {
        tuesday: deleteField()
      });
    }
    catch(error) {
      console.log(error);
    }
  }
  if (notWeekdayList.includes("wed")) {
    try {
      await updateDoc(pageEditRef, {
        wednesday: deleteField()
      });
    }
    catch(error) {
      console.log(error);
    }
  }
  if (notWeekdayList.includes("thu")) {
    try {
      await updateDoc(pageEditRef, {
        thursday: deleteField()
      });
    }
    catch(error) {
      console.log(error);
    }
  }
  if (notWeekdayList.includes("fri")) {
    try {
      await updateDoc(pageEditRef, {
        friday: deleteField()
      });
    }
    catch(error) {
      console.log(error);
    }
  }
}

if(editBtn) {
  editBtn.addEventListener("click", submitEdits);
}



//Master Cleaning Log
const cleanForm = document.getElementById("clean-form")
const cleanFormSubmit = document.getElementById("clean-form-submit")

const cleanDateMM = document.getElementById("clean-date-mm");
const cleanDateDD = document.getElementById("clean-date-dd");
const cleanDateYYYY = document.getElementById("clean-date-yyyy");

var cleanDate = new Date();

var cleanMM = cleanDate.getMonth();
cleanMM = cleanMM + 1;
var cleanDD = cleanDate.getDate();
var cleanYYYY = cleanDate.getFullYear();

if(cleanDateMM) {
  cleanDateMM.innerHTML = cleanMM;
}
if(cleanDateDD) {
  cleanDateDD.innerHTML = cleanDD;
}
if(cleanDateYYYY) {
  cleanDateYYYY.innerHTML = cleanYYYY;
}

const changeCleanDateBtn = document.getElementById("clean-date-edit");
const submitCleanDateBtn = document.getElementById("clean-date-submit");

function changeCleanDate() {
  cleanDateMM.innerHTML = "<input type='text' name='cleanDateMM' id='new-clean-date-mm' class='mm'>"
  cleanDateDD.innerHTML = "<input type='text' name='cleanDateMM' id='new-clean-date-dd' class='mm'>"
  cleanDateYYYY.innerHTML = "<input type='text' name='cleanDateYYYY' id='new-clean-date-yyyy' class='yyyy'>"
};

function submitCleanDate() {
  var newCleanDateMM = document.getElementById("new-clean-date-mm").value;
  var newCleanDateDD = document.getElementById("new-clean-date-dd").value;
  var newCleanDateYYYY = document.getElementById("new-clean-date-yyyy").value;
  if(typeof newCleanDateMM === 'undefined') {
    newCleanDateMM = document.getElementById("clean-date-mm").innerHTML;
    newCleanDateDD = document.getElementById("clean-date-dd").innerHTML;
    newCleanDateYYYY = document.getElementById("clean-date-yyyy").innerHTML;
  }
  console.log(newCleanDateMM);
  console.log(newCleanDateDD);
  console.log(newCleanDateYYYY);

  const dateArray = checkDate(newCleanDateMM, newCleanDateDD, newCleanDateYYYY);
  cleanDate = new Date(dateArray[0], dateArray[1]-1, dateArray[2]);

  alert("Date submitted!");
  if(cleanDateMM) {
    cleanDateMM.innerHTML = newCleanDateMM;
  }
  if(cleanDateDD) {
    cleanDateDD.innerHTML = newCleanDateDD;
  }
  if(cleanDateYYYY) {
    cleanDateYYYY.innerHTML = newCleanDateYYYY;
  }
  createCleanDivs();
}

if(changeCleanDateBtn) {
  changeCleanDateBtn.addEventListener("click", changeCleanDate);
}

if(submitCleanDateBtn) {
  submitCleanDateBtn.addEventListener("click", submitCleanDate);
}

const areas = ["front-entry", "front-bath", "office", "emp-break",
               "proc", "air-shower", "mush-store", "gar",
               "mush-fruit", "mush-inoc", "rough", "power-control",
               "grow", "load-bay", "outside", "misc"];

const areaNames = ["FRONT ENTRYWAY", "FRONT BATHROOMS", "OFFICE AREA", "EMPLOYEE BREAKROOM",
                   "PROCESSING ROOM", "AIR SHOWER ROOM", "MUSHROOM STORAGE ROOM", "GARAGE",
                   "MUSHROOM FRUITING ROOMS", "MUSHROOM INOCULATION AREA", "ROUGH PROCESSING", "POWER CONTROL ROOM",
                   "GROW ROOM", "LOADING BAY", "OUTSIDE BUILDING", "MISC"];

const areaHolder = document.getElementById("four-by-four");

function createCleanDivs() {
  console.log("inside createCleanDivs");
  for(let i = 0; i<areas.length; i++) {
    var newDiv = document.createElement("div");
    newDiv.id = areas[i];
    newDiv.innerHTML = areaNames[i];
    newDiv.className = 'area';
    console.log(newDiv);
    
    document.getElementById("four-by-four").appendChild(newDiv);
  }
}

if(areaHolder) {
  //console.log("area holder exists");
  window.addEventListener("DOMContentLoaded", createCleanDivs);
}

async function grayOut() {
  const dayIndexToCheck = cleanDate.getDay();
  const dayofWeektoCheck = weekday[dayIndexToCheck];

  for (let i = 0; i < areas.length; i++) {
    const thisArea = document.getElementById(areas[i]);
    var elem = thisArea;
    var style = window.getComputedStyle(elem);
    var color = style.backgroundColor;
    if (color != "rgb(123, 193, 67)") {
      const text = thisArea.textContent.trim();
      const output = text.replace(
      /(\w)(\w*)/g,
      (_, firstChar, rest) => firstChar + rest.toLowerCase()
      );
      var areaName = "Clean " + output;

      const toCheck = query(collection(db, "tasks"), where("task", "==", areaName), where(dayofWeektoCheck, "!=", "X"));

      try {
        const toCheckSnapshot = await getDocs(toCheck);
        toCheckSnapshot.forEach((doc) => {
          
        });
      }
      catch(error) {
        console.log(error);
      }
    }
    else {}
  }
}

async function chooseArea() {
  const dayIndex = cleanDate.getDay();
  const dayofWeek = weekday[dayIndex];

  console.log(dayofWeek);

  var areaName;

  const areas = document.getElementsByClassName("area");
  for (let i = 0; i < areas.length; i++) {
    var elem = areas[i];
    var style = window.getComputedStyle(elem);
    var color = style.backgroundColor;
    if (color == "rgb(123, 193, 67)") {
      const text = areas[i].textContent.trim();
      const output = text.replace(
      /(\w)(\w*)/g,
      (_, firstChar, rest) => firstChar + rest.toLowerCase()
      );
      areaName = "Clean " + output;
    }
    else {

    }
  }

  const cleanDoc = query(collection(db, "tasks"), where("task", "==", areaName), where(dayofWeek, "==", "X"));
  var docID;

  try {
    const cleanSnapshot = await getDocs(cleanDoc);
    cleanSnapshot.forEach((doc) => {
      docID = doc.id;
    });
  }
  catch(error) {
    console.log(error);
  }

  const cleanRef = collection(db, "tasks", docID, "subtasks");
  var subtaskName;
  var subtaskList = [];
  var t = 0;

  try {
    const subtasks = await getDocs(cleanRef);
    subtasks.forEach((doc) => {
      subtaskName = doc.get("task");
      var subtaskID = "st-" + t;
      var subtaskInput = "ST" + t;
      var innerString = "<label><b>" + subtaskName + ": </b></label><br><br><input type='text' name='" + subtaskInput + "' id='" + subtaskID + "' class='entry'>";
      subtaskList.push(innerString);
      t ++;
    });
  }
  catch(error) {
    console.log(error);
  }

  const subtaskDisplay = document.getElementById("subtask-list");
  const subtaskFragment = document.createDocumentFragment();

  for(let i = 0; i < subtaskList.length; i++) {
    const subtaskHolder = document.createElement("div");
    subtaskHolder.className = "subtask-row";
    subtaskHolder.innerHTML = subtaskList[i];
    subtaskFragment.appendChild(subtaskHolder);
  }

  subtaskDisplay.appendChild(subtaskFragment);

  const subtaskTitle = document.getElementById("subtask");
  subtaskTitle.textContent = areaName;


  const subtaskPopUp = document.getElementById("subtask-pop-up");
  subtaskPopUp.style.display = "Flex";
}

function checkDate(dateMM, dateDD, dateYYYY) {
  const having31 = [1, 3, 5, 7, 8, 10, 12];
  const having30 = [4, 6, 9, 11];
  const leapYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2100];
  var dateList = [];
  var alert;

  if (dateMM != "" && dateDD != "" && dateYYYY != "") {
    if((dateMM.length == 2 || dateMM.length == 1) && checkIfStringHasOnlyDigits(dateMM) == true) {
      if(parseInt(dateMM) <= 12){
        if((dateDD.length == 2 || dateDD.length == 1) && checkIfStringHasOnlyDigits(dateDD) == true) {
          if(having31.includes(parseInt(dateMM))){
            if(parseInt(dateDD) <= 31) {
              if(dateYYYY.length == 4 && checkIfStringHasOnlyDigits(dateYYYY) == true) {
                dateList = [dateYYYY, dateMM, dateDD];
                return dateList;
              }
              else {
                alert = "Please enter an appropriate year value.";
                return alert;
              }
            }
            else {
              alert = "Please enter an appropriate day value.";
              return alert;
            }
          }
          else if(having30.includes(parseInt(dateMM))){
            if(parseInt(dateDD) <= 30) {
              console.log("day is real");
              if(dateYYYY.length == 4 && checkIfStringHasOnlyDigits(dateYYYY) == true) {
                console.log("year is real");
                dateList = [dateYYYY, dateMM, dateDD];
                return dateList;
              }
              else {
                alert = "Please enter an appropriate year value.";
                return alert;
              }
            }
            else {
              alert = "Please enter an appropriate day value.";
              return alert;
            }
          }
          else {
            if(parseInt(dateDD) <= 28) {
              console.log("day is real");
              if(dateYYYY.length == 4 && checkIfStringHasOnlyDigits(dateYYYY) == true) {
                console.log("year is real");
                dateList = [dateYYYY, dateMM, dateDD];
                return dateList;
              }
              else {
                alert = "Please enter an appropriate year value.";
                return alert;
              }
            }
            else if(parseInt(dateDD) == 29) {
              if(leapYears.includes(parseInt(dateYYYY))){
                console.log("year is real");
                dateList = [dateYYYY, dateMM, dateDD];
                return dateList;
              }
              else {
                alert = "Please enter an appropriate day value.";
                return alert;
              }
            }
            else {
              alert = "Please enter an appropriate day value.";
              return alert;
            }
          }
        }
        else {
          alert = "Please enter an appropriate day value.";
          return alert;
        }
      }
      else {
        alert = "Please enter an appropriate month value.";
        return alert;
      }
    }
    else {
      alert = "Please enter an appropriate month value.";
      return alert;
    }
  }
  else {
    alert = "Please enter the date.";
    return alert;
  }
}

if(cleanFormSubmit) {
  cleanFormSubmit.addEventListener("click", chooseArea);
}



function checkIfStringHasOnlyDigits(_string) {
  for (let i = _string.length - 1; i >= 0; i--) {
    const codeValue = _string.charCodeAt(i);
    if (codeValue < 48 || codeValue > 57) 
    return false
  }
  return true
}

function checkIfStringHasOnlyDigitsAndDecimal(_string) {
  for (let i = _string.length - 1; i >= 0; i--) {
    const codeValue = _string.charCodeAt(i);
    if (codeValue < 44 || codeValue > 57) 
    return false
  }
  return true
}


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
