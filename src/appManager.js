const { desktopCapturer } = require('electron');

const programs_search_bar = document.getElementById('programs-search-bar');
const unadded_programs_table = document.getElementById('unadded-programs');

const translations = ["Google Chrome", "Visual Studio Code", "Internet Explorer", "Spotify", "Microsoft Excel", "Microsoft Word", "Discord"];
let tags = ["Twitch", "Fortnite", "Twitter", "Youtube"];

let openWindows;
let filteredOpenWindows;
let windowDisplayNames;


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
        console.log(openWindows);
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



function displayUnaddedFilteredWindows(){
    //TODO Filter out already added windows
    

    unadded_programs_table.innerHTML = "";
    //Create new table row elements for every matching process

    for(let i = 0; i < filteredOpenWindows.length; i++){
        let htmlString = (`<tr><td> ${filteredOpenWindows[i]} </td> <td>${i+1}</td></tr>`)
        unadded_programs_table.innerHTML += htmlString;
    }

}


//Refresh Windows on Search bar Focus
programs_search_bar.addEventListener('focusin', ()=> {
    getCurrentlyOpenWindows();
    let input = programs_search_bar.value;
    searchWindows(input);
    displayUnaddedFilteredWindows();
    
});

programs_search_bar.addEventListener('input', () => {
    let input = programs_search_bar.value;
    searchWindows(input);
    displayUnaddedFilteredWindows();
});

//Get Open Windows Once before focus in
getCurrentlyOpenWindows();
