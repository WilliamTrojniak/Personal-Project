const electron = require('electron');


const SCENES = [document.getElementById("splash-screen-content"), document.getElementById("schedule-screen-content"), document.getElementById("apps-screen-content")];


const SCENE_ENUM = {
    START: 0,
    SCHEDULE: 1,
    APPS: 2
};

let scene_index = SCENE_ENUM.START;

exports.changeScene = function(index){
    for(let i = 0; i < SCENES.length; i++){
        SCENES[i].style.display = "none";
    }
    SCENES[index].style.display = "grid";
}

// splash_screen_content.style.display = "none";