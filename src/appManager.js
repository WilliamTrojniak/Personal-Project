const { desktopCapturer } = require('electron');

const programs_search_bar = document.getElementById('programs-search-bar');
const unadded_programs_table = document.getElementById('unadded-programs');
const added_programs_table = document.getElementById('added-programs');

const translations = ["Google Chrome", "Visual Studio Code", "Internet Explorer", "Spotify", "Microsoft Excel", "Microsoft Word", "Discord", "Paint.net", "Skype", "Dropbox"];
let tags = ["Twitch", "Fortnite", "Twitter", "Youtube"];

let openWindows;
let filteredOpenWindows;
let windowDisplayNames;

let addedPrograms = new Set();


function translateAndApplyTagsToOpenWindows(windows){
    //Append User-defined Tags
    for(let i = 0; i < windows.length; i++){
        let tagsToAppend = [];
        for(let t = 0; t < tags.length; t++){
            if(windows[i].name.toLowerCase().indexOf(tags[t].toLowerCase()) !== -1){
                tagsToAppend.push(tags[t]);
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
        let htmlString = (`<tr><td> ${filteredOpenWindows[i]} </td> <td><button class="unaddedprogramaddbutton" id="unaddedprogrambutton${i}" value="${filteredOpenWindows[i]}"></button></td></tr>`)
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
                console.clear();
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
        let htmlString = (`<tr><td> ${addedProgramsArr[i]} </td> <td><button class="addedprogramaddbutton" id="addedprogrambutton${i}" value="${addedProgramsArr[i]}"></button></td></tr>`)
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

//Get Open Windows Once before focus in
getCurrentlyOpenWindows();

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

    console.clear();
    console.log(`Open Windows, Filtered Windows, Window Display Names, Added Programs`);
    console.log(openWindows);
    console.log(filteredOpenWindows);
    console.log(windowDisplayNames);
    console.log(addedPrograms);
}