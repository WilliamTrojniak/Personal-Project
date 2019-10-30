const electron = require('electron');
const path = require('path');
const fs = require('fs');
const vs = require('./viewManager');

const hourOptions = document.getElementsByClassName("hour-select");
const minuteOptions = document.getElementsByClassName("minute-select");
const day_divs = document.getElementsByClassName("day-container");

const DAYS = {
    "0": "Sun",
    "1": "Mon",
    "2": "Tue",
    "3": "Wed",
    "4": "Thu",
    "5": "Fri",
    "6": "Sat",
    "7": "Breaks"
}

const apply_button = document.getElementById('schedule-settings-apply');
const save_button = document.getElementById('schedule-settings-save');
const SETTINGS_FILE = "schedulesettings.json";
const FILEPATH = path.join((electron.app || electron.remote.app).getPath('userData'), SETTINGS_FILE);

function loadSelectOptions(){
    for(let i = 0; i < hourOptions.length; i++){
        for(let t = 0; t <= 24; t++){
            hourOptions[i].innerHTML += (`<option value = ${t}>${t}</option>`);
        }
    }

    for(let i = 0; i < minuteOptions.length; i++){
        for(let t = 0; t < 4; t++){
            if(t === 0){
                minuteOptions[i].innerHTML += (`<option value = ${t*15}>00</option>`);
            }else{
                minuteOptions[i].innerHTML += (`<option value = ${t*15}>${t*15}</option>`);
            }   
        }
    }
}

function main(){
    loadSelectOptions();
    loadSettings();
}
main();


// Saving and Loading Data
save_button.addEventListener('click', () => {
    applySettings();
    vs.changeScene(0);

});

apply_button.addEventListener('click', applySettings);

function applySettings(){

    let output = {
        "Schedule": {
            "Sun": [],
            "Mon": [],
            "Tue": [],
            "Wed": [],
            "Thu": [],
            "Fri": [],
            "Sat": []
        },
        "Breaks": []
    }

    for(let i = 0; i < day_divs.length; i++){
        let key = DAYS[`${i}`];
        if(i <= 6){
            output.Schedule[key][0] = parseInt(day_divs[i].childNodes[3].childNodes[3].value);
            output.Schedule[key][1] = parseInt(day_divs[i].childNodes[3].childNodes[5].value);
            output.Schedule[key][2] = parseInt(day_divs[i].childNodes[3].childNodes[9].value);
            output.Schedule[key][3] = parseInt(day_divs[i].childNodes[3].childNodes[11].value);
            output.Schedule[key][4] = (day_divs[i].childNodes[3].childNodes[15].childNodes[1].checked);
        }else{
            output[key][0] = parseInt(day_divs[i].childNodes[3].childNodes[1].value);
            output[key][1] = parseInt(day_divs[i].childNodes[3].childNodes[3].value);
            output[key][2] = (day_divs[i].childNodes[3].childNodes[7].childNodes[1].checked);
        }

    }
    
    console.log(output);

    fs.writeFile(FILEPATH, JSON.stringify(output), (err) => {
        if (err) throw err;
        
    });
}



function loadSettings(){
    let data;
    try {
        data = JSON.parse(fs.readFileSync(FILEPATH));
        

    }catch(error){
        console.error("No previous data");
    }

    for(let i = 0; i < day_divs.length; i++){
        let key = DAYS[`${i}`];
        if(i <= 6){
            day_divs[i].childNodes[3].childNodes[3].value = data.Schedule[key][0].toString();
            (day_divs[i].childNodes[3].childNodes[5].value) = data.Schedule[key][1].toString();
            (day_divs[i].childNodes[3].childNodes[9].value) = data.Schedule[key][2].toString();
            (day_divs[i].childNodes[3].childNodes[11].value) = data.Schedule[key][3].toString();
            (day_divs[i].childNodes[3].childNodes[15].childNodes[1].checked) = data.Schedule[key][4];
        }else{
            (day_divs[i].childNodes[3].childNodes[1].value) = data[key][0].toString();
            (day_divs[i].childNodes[3].childNodes[3].value) = data[key][1].toString();
            (day_divs[i].childNodes[3].childNodes[7].childNodes[1].checked) = data[key][2];
        }

    }
}

let date = new Date();

console.log(date.getHours());