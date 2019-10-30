const electron = require('electron');
const { desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');

const SETTINGS_FILE = "schedulesettings.json";
const FILEPATH = path.join((electron.app || electron.remote.app).getPath('userData'), SETTINGS_FILE);

const APP_SETTINGS_FILE = "applicationsettings.json";
const APP_FILEPATH = path.join((electron.app || electron.remote.app).getPath('userData'), APP_SETTINGS_FILE);

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

let checkForBlacklistedPrograms = false;

function main(){
    loadAppSettings();
    getCurrentlyOpenWindows();
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
            checkForBlacklistedPrograms = true;

        }else{
            checkForBlacklistedPrograms = false;
        }

    }
}

let openWindows;
let filteredOpenWindows;
let windowDisplayNames;

let addedPrograms = new Set();

const translations = ["Google Chrome", "Visual Studio Code", "Internet Explorer", "Spotify", "Microsoft Excel", "Microsoft Word", "Discord", "Paint.net", "Skype", "Dropbox", "Twitter"];
let tags = new Set();

function translateAndApplyTagsToOpenWindows(windows){
    let tagsArr = Array.from(tags);
    //Append User-defined Tags
    for(let i = 0; i < windows.length; i++){
        let tagsToAppend = [];
        for(let t = 0; t < tagsArr.length; t++){
            if(windows[i].name.toLowerCase().indexOf(tagsArr[t].toLowerCase()) !== -1){
                tagsToAppend.push(tagsArr[t]);
            }
        }  
        openWindows[i].tags = tagsToAppend;
    }

    //Perform Translation
    for(let i = 0; i < windows.length; i++){
        for(let t = 0; t < translations.length; t++){
            if(windows[i].name.toLowerCase().indexOf(translations[t].toLowerCase()) !== -1){
                openWindows[i].name = translations[t];
                break;
            }
        }    
    }
}

function getWindowsDisplayNames(windows){
    let window_names = new Set();
    for(let i = 0; i < windows.length; i++){
        window_names.add(windows[i].name);
    }
    windowDisplayNames = Array.from(window_names);
    
}

function getCurrentlyOpenWindows(){
    desktopCapturer.getSources({types: ['window']}).then((defs)=>{
        openWindows = defs;
        translateAndApplyTagsToOpenWindows(openWindows);
        getWindowsDisplayNames(openWindows);
        if(checkForBlacklistedPrograms){
            checkForBlacklistedProgramsFunc();
        }
        
    });
}

function checkForBlacklistedProgramsFunc() {
    let addedArr = Array.from(addedPrograms);
    let tagsArr = Array.from(tags);

    for(let i = 0; i < openWindows.length; i++){
        for(let t = 0; t < addedArr.length; t++){
            if(addedArr[t] === openWindows[i].name){
                console.log("Blacklisted window found");
                break;
            }
        }
        for(let k = 0; k < openWindows[i].tags.length; k++){
            for(let j = 0; j < tagsArr.length; j++){
                if(tagsArr[j] === openWindows[i].tags[k]){
                    console.log(`Blacklisted tag found: ${tagsArr[j]}`);
                    break;
                }
            }
                    
        }
        
    }
}

function loadAppSettings(){
    let appdata;
    addedPrograms.clear();
    tags.clear();
    try {
         appdata = JSON.parse(fs.readFileSync(APP_FILEPATH));

         for(let i = 0; i < appdata.Tags.length; i++){
            
            tags.add(appdata.Tags[i])
        }
        
        for(let i = 0; i < appdata.AddedPrograms.length; i++){
            
            addedPrograms.add(appdata.AddedPrograms[i])
        }
        

    }catch(error){
        console.error("No previous data");
    }
   
}







main();

setInterval(main, 59000)