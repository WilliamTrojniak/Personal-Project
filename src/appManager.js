const electron = require('electron');
const { desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
const vs = require('./viewManager');


const programs_search_bar = document.getElementById('programs-search-bar');
const unadded_programs_table = document.getElementById('unadded-programs');
const added_programs_table = document.getElementById('added-programs');

const tags_search_bar = document.getElementById("tags-search-bar");
const added_tags_table = document.getElementById("tags-table");

const translations = ["Google Chrome", "Visual Studio Code", "Internet Explorer", "Spotify", "Microsoft Excel", "Microsoft Word", "Discord", "Paint.net", "Skype", "Dropbox", "Twitter"];
let tags = new Set();

const apply_button = document.getElementById('app-settings-apply');
const save_button = document.getElementById('app-settings-save');
const SETTINGS_FILE = "applicationsettings.json";
const FILEPATH = path.join((electron.app || electron.remote.app).getPath('userData'), SETTINGS_FILE);



const schedule_button = document.getElementById("schedule-button");
const apps_button = document.getElementById("apps-button");
schedule_button.addEventListener('click', () => {
    vs.changeScene(schedule_button.value);
});

apps_button.addEventListener('click', () =>{
    vs.changeScene(apps_button.value);
});


let openWindows;
let filteredOpenWindows;
let windowDisplayNames;

let addedPrograms = new Set();


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
        updateDisplay();
    });
}

function searchWindows(keyword){
    filteredOpenWindows = [];
    for(let i = 0; i < windowDisplayNames.length; i++){
        if(windowDisplayNames[i].toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
            filteredOpenWindows.push(windowDisplayNames[i]);
        }
    }
}

function assignButtonAddProgramFunction(){
    let addbuttons = document.getElementsByClassName("unaddedprogramaddbutton");
    for(let i = 0; i < addbuttons.length; i++){
        addbuttons[i].addEventListener('click', () =>{
            addProgram(addbuttons[i].value);
        })
    }
}


function createHTMLAddUnaddedProgramButton(){
    unadded_programs_table.innerHTML = "";
    for(let i = 0; i < filteredOpenWindows.length; i++){
        let htmlString = (`<tr><td> ${filteredOpenWindows[i]} </td> <td><button class="unaddedprogramaddbutton" id="unaddedprogrambutton${i}" value="${filteredOpenWindows[i]}">+</button></td></tr>`)
        unadded_programs_table.innerHTML += htmlString;
    }
    assignButtonAddProgramFunction();
}

function removeAddedPrograms(){
    let addedProgramsArr = Array.from(addedPrograms);
    for(let i = addedProgramsArr.length-1; i >=0 ; i--){
        for(let t = windowDisplayNames.length-1; t >= 0; t--){
            if(addedProgramsArr[i] === windowDisplayNames[t]){
                windowDisplayNames.splice(t, 1);
            }
        }
    }
}
function displayUnaddedFilteredWindows(){
    createHTMLAddUnaddedProgramButton();
}

function removeProgram(val){
    let addedProgramsArr = Array.from(addedPrograms);
    addedPrograms.delete(val);

    displayUnaddedFilteredWindows();
    getCurrentlyOpenWindows();
    updateDisplay();
    

}

function assignButtonRemoveProgramFunction(){
    let removeButtons = document.getElementsByClassName("addedprogramaddbutton");
    for(let i = 0; i < removeButtons.length; i++){
        removeButtons[i].addEventListener('click', () =>{
            removeProgram(removeButtons[i].value);
        })
    }
}


function createHTMLRemoveAddedProgramButton(){
    added_programs_table.innerHTML = "";
    let addedProgramsArr = Array.from(addedPrograms);
    for(let i = 0; i < addedProgramsArr.length; i++){
        let htmlString = (`<tr><td> ${addedProgramsArr[i]} </td> <td><button class="addedprogramaddbutton" id="addedprogrambutton${i}" value="${addedProgramsArr[i]}">-</button></td></tr>`)
        added_programs_table.innerHTML += htmlString;
    }
    assignButtonRemoveProgramFunction();
}


function displayAddedWindows(){
    createHTMLRemoveAddedProgramButton();
}

//Refresh Windows on Search bar Focus
programs_search_bar.addEventListener('focusin', ()=> {
    getCurrentlyOpenWindows();
    updateDisplay();
    
});

programs_search_bar.addEventListener('input', () => {
    updateDisplay();
});

//Load Previous Settings
loadSettings();

//Get Open Windows Once before focus in
getCurrentlyOpenWindows();

//Display Previously Added Tags
updateTagsDisplay();

//Adding And Removing Programs
function addProgram(val){
    addedPrograms.add(val);
    filteredOpenWindows.splice(filteredOpenWindows.indexOf(val),1);
    updateDisplay();
}

function updateDisplay(){
    let input = programs_search_bar.value;
    removeAddedPrograms();
    searchWindows(input);
    displayUnaddedFilteredWindows();
    displayAddedWindows();

    // console.clear();
    // console.log(`Open Windows, Filtered Windows, Window Display Names, Added Programs`);
    // console.log(openWindows);
    // console.log(filteredOpenWindows);
    // console.log(windowDisplayNames);
    // console.log(addedPrograms);
}



// Tag Handling
tags_search_bar.addEventListener("keydown", (event) => {
    if(event.code === "Enter"){
        if(tags_search_bar.value !== "" && tags_search_bar.value !== " " && tags_search_bar.value.length <= 16){
            tags.add(tags_search_bar.value);
            updateTagsDisplay();
        }
    }
});


function updateTagsDisplay(){
    added_tags_table.innerHTML = "";
    let tagsArr = Array.from(tags);
    for(let i = 0; i < tagsArr.length; i++){
        let htmlString = (`<tr><td> ${tagsArr[i]} </td> <td><button class="addedtagbutton" id="addedtagbutton${i}" value="${tagsArr[i]}">-</button></td></tr>`)
        added_tags_table.innerHTML += htmlString;
    }
    assignButtonTagRemoveProgramFunction();
}

function assignButtonTagRemoveProgramFunction(){
    let removeButtons = document.getElementsByClassName("addedtagbutton");
    for(let i = 0; i < removeButtons.length; i++){
        removeButtons[i].addEventListener('click', () =>{
            removeTag(removeButtons[i].value);
        })
    }
}

function removeTag(val){
    tags.delete(val);
    updateTagsDisplay();
}

// Settings saving and loading
save_button.addEventListener('click', () => {

    applySettings();
    vs.changeScene(0);

});

apply_button.addEventListener('click', applySettings);

function applySettings(){
    let output = {
        "Tags": [],
        "AddedPrograms": []
    }

    let tagsArr = Array.from(tags);
    for(let t = 0; t < tagsArr.length; t++){
        output.Tags[t] = tagsArr[t];
    }

    let addedProgramsArr = Array.from(addedPrograms);
    for(let t = 0; t < addedProgramsArr.length; t++){
        output.AddedPrograms[t] = addedProgramsArr[t];
    }

    
    fs.writeFile(FILEPATH, JSON.stringify(output), (err) => {
        if (err) throw err;
        
    });
}



function loadSettings(){
    try {
        let data = JSON.parse(fs.readFileSync(FILEPATH));
        for(let i = 0; i < data.Tags.length; i++){
            tags.add(data.Tags[i])
        }
        
        for(let i = 0; i < data.AddedPrograms.length; i++){
            addedPrograms.add(data.AddedPrograms[i])
        }

    }catch(error){
        console.error("No previous data");
    }
}
