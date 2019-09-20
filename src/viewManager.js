const electron = require('electron');

const SCENES = [document.getElementById("splash-screen-content"), document.getElementById("schedule-screen-content"), document.getElementById("apps-screen-content")];
const schedule_button = document.getElementById("schedule-button");
const apps_button = document.getElementById("apps-button");

const SCENE_ENUM = {
    START: 0,
    SCHEDULE: 1,
    APPS: 2
};

let scene_index = SCENE_ENUM.START;

schedule_button.addEventListener('click', () => {
    changeScene(schedule_button.value);
});

apps_button.addEventListener('click', () =>{
    changeScene(apps_button.value);
});




function changeScene(index){
    for(let i = 0; i < SCENES.length; i++){
        SCENES[i].style.display = "none";
    }
    SCENES[index].style.display = "grid";
}

// splash_screen_content.style.display = "none";