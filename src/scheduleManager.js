const path = require('path');
const fs = require('fs');
const vs = require('./viewManager');

const hourOptions = document.getElementsByClassName("hour-select");
const minuteOptions = document.getElementsByClassName("minute-select");

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
}
main();

let date = new Date();

console.log(date.getHours());