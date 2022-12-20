import document from "document";
import { me as appbit } from "appbit";

import { battery } from "power";
import * as simpleActivity from "./simple/activity";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleSettings from "./simple/device-settings";

let screen = document.getElementById("screen");
let background = document.getElementById("background");
let percentText = document.getElementById("percentText");
let dividers = document.getElementsByClassName("divider");

let cycleItems = document.getElementsByClassName("cycle-item");
let statTexts = document.getElementsByClassName("main-text");

let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");
let txtSeconds = document.getElementById("txtSeconds");

let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");

const arcContainer = document.getElementById("arcContainer"); 
const animArc = arcContainer.getElementById("arcAnim");
const arc = arcContainer.getElementById("arc");
const animCircle = arcContainer.getElementById("circleAnim");
const circle = arcContainer.getElementById("circle");


var colors = ["white","red","orangered","deepskyblue","limegreen","fuchsia","yellow"];
var hour=0, minute=0, second=0;
var currentBPM=0, previousBPM=0;

var calories=0, steps=0, distance=0, floors=0, am=0;



let currentItem = 0
cycleItems[currentItem].style.display = "inline";
arc.style.fill = colors[currentItem];

screen.addEventListener("click", (evt) => {
  cycleItem();
  initArc();
});

function cycleItem(){
  cycleItems[currentItem].style.display = "none";
  if(currentItem >= cycleItems.length-1){
     currentItem = 0;
  }else{
    currentItem++
  }
  arcContainer.style.fill = colors[currentItem];
  arc.style.fill = colors[currentItem];
  cycleItems[currentItem].style.display = "inline";
}

function initArc(){
  let previousAngle = arc.sweepAngle;
  //console.log(previousAngle);
  //update these to take in the goals instead of hardcoded
  switch(currentItem){
    case 0://time
      animateArc(previousAngle, second, 60);
    break;
    case 1://bpm
      animateArc(previousAngle, currentBPM, 220);
    break;
    case 2://caloried
      //console.log(calories);
      animateArc(previousAngle, calories, 60);
    break;
    case 3://steps
      animateArc(previousAngle, steps, 10000);
    break;
    case 4://distance
      animateArc(previousAngle, distance, 100);//find out how this should be calculated for kms
    break;
    case 5://floors
      animateArc(previousAngle, floors, 10);
    break;
    case 6://am
      animateArc(previousAngle, am, 22);
    break;
  }
}

function animateArc(from, to, step){

  if(currentItem == 2){
    console.log("from: " + calcArc(from, step));
    console.log("to: " + calcArc(from, step)); 
    console.log(from);
    console.log(to);
  }
  let fromAngle = calcArc(from, step);
  let toAngle = calcArc(to, step);
    console.log(toAngle);
    animArc.from = fromAngle;
    animArc.to = toAngle;
    arc.animate("enable");
  
    animCircle.from = fromAngle;
    animCircle.to = toAngle;
    circle.animate("enable");    
  
}

function calcArc(current, steps) {
  if(current <= 0){
     current = steps;
  }
  let angle = Math.floor((360 / steps) * current);
  console.log("angle1:" + angle);
  angle = angle % 360;
  console.log("angleMod: " + angle);
  return angle > 360 ? 360 : angle;
}


/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  
  if (data.colorBackground) {
    background.style.fill = data.colorBackground;
  }
  if(data.colorHeader){
     txtBase.style.fill = data.colorHeader;
  }
  if (data.colorDividers) {
    dividers.forEach(item => {
      item.style.fill = data.colorDividers;
    });
  }
  if (data.colorTime) {
    txtTime.style.fill = data.colorTime;
  }
  if (data.colorDate) {
    txtDate.style.fill = data.colorDate;
  }
  
  if (data.colorActivity) {
    statsText.forEach((item, index) => {
      item.style.fill = data.colorActivity;
    });
  }
  
  if (data.colorHRM) {
    txtHRM.style.fill = data.colorHRM;
  }
  if (data.colorImgHRM) {
    imgHRM.style.fill = data.colorImgHRM;
  }
}
simpleSettings.initialize(settingsCallback);

/* --------- CLOCK ---------- */
function clockCallback(data) {
  hour = data.hour;
  minute = data.minute;
  second = data.second;
  txtTime.text = data.time;
  txtDate.text = data.date;
  txtSeconds.text = data.second;
  if(currentItem == 0){
    animateArc(second-1, second, 60);
  }
  updateBattery();
}
simpleClock.initialize("minutes", "shortDate", clockCallback);




/* ------- ACTIVITY --------- */
function activityCallback(data) {
  //calories
//   if(appbit.permissions.granted("access_activity")){
//     if(goals.adjusted.calories != undefined){
//       console.log(goals.adjusted.calories);
//     }else{
      
//     } 
    
//   }
  
  calories = data.calories.pretty;
  steps = data.steps.pretty;
  distance = data.distance.pretty;
  floors = data.elevationGain.pretty;
  am = data.activeMinutes.pretty;
  if(currentItem > 1){
    statTexts[currentItem].text = data[Object.keys(data)[currentItem-2]].pretty;     
  }

  // statsCycleItems.forEach((item, index) => {
  //   let img = item.firstChild;
  //   let txt = img.nextSibling;
  //   txt.text = data[Object.keys(data)[index]].pretty;
  //   // Reposition the activity icon to the left of the variable length text
  //   img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  // });
}
simpleActivity.initialize("seconds", activityCallback);

/* -------- HRM ------------- */
var previousBPM = 0;
var currentBPM = 0;
function hrmCallback(data) {
  txtHRM.text = data.bpm==null? `--` : `${data.bpm}`;
  if(data.bpm == null || isNaN(data.bpm)){
     currentBPM = 0;
  }else{
    currentBPM = data.bpm;
  }
  if (data.zone === "out-of-range") {
    imgHRM.href = "images/48/open/stat_hr.png";
  } else {
    imgHRM.href = "images/48/solid/stat_hr.png";
  }
  if (data.bpm !== "--") {
    iconHRM.animate("highlight");
  }
  
  if(currentItem == 1){
    animateArc(previousBPM, currentBPM, 220);
  }
  previousBPM = currentBPM;
}
simpleHRM.initialize(hrmCallback);

function updateBattery(){
  percentText.text = (Math.floor(battery.chargeLevel) + "%");
}
