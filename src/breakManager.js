const electron = require('electron');
const path = require('path');
const fs = require('fs');

const SETTINGS_FILE = "schedulesettings.json";
const FILEPATH = path.join((electron.app || electron.remote.app).getPath('userData'), SETTINGS_FILE);

let data;
let min;
let hour;
let day;

const DAYS = {
    "0": "Sun",
    "1": "Mon",
    "2": "Tue",
    "3": "Wed",
    "4": "Thu",
    "5": "Fri",
    "6": "Sat"
}

function loadSettings(){
    try {
        data = JSON.parse(fs.readFileSync(FILEPATH));
        
    }catch(error){
        console.error("No previous data");
    }
}



function main(){
    loadSettings();
    let date = new Date();
    min = date.getMinutes();
    hour = date.getHours();
    day = date.getDay();
    let key = DAYS[`${day}`];
    if(data["Schedule"][key][4]){ // Check if the schedule is active for the current day and are within time restraints
        if(data["Schedule"][key][0]*60 +data["Schedule"][key][1] === hour*60 + min){
            console.log("Entered worktime");
        }else if( data["Schedule"][key][2]*60 +data["Schedule"][key][3] === hour*60 + min){
            console.log("Entered worktime");
        }else if(data["Schedule"][key][0]*60 +data["Schedule"][key][1] < hour*60 + min && data["Schedule"][key][2]*60 +data["Schedule"][key][3] > hour*60 + min){ //Check if within worktime
            console.log("In worktime");
            if(data["Breaks"][2] &&(hour*60+min)%(data["Breaks"][0]*60+data["Breaks"][1]) === (data["Schedule"][key][0]*60 +data["Schedule"][key][1])%(data["Breaks"][0]*60+data["Breaks"][1])){ //Check if the user should take a break
                console.log("Breaktime");
            }

        }

    }
}










main();

setInterval(main, 59000)