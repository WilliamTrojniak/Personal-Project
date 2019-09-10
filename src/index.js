const electron = require('electron');
const remote = electron.remote;

const main_content = document.getElementById("main-content");
const menubar = document.getElementById("menubar");
const menubar_height = window.getComputedStyle(menubar).getPropertyValue('height');
const menubar_height_int = parseInt(menubar_height.replace("px",""));

const main_close_button = document.getElementById("main-close-button");
main_close_button.addEventListener('click', () => {
    let window = remote.getCurrentWindow(); //TODO Fully quit program on MacOSx
    window.close();
});


function resizeWindow(){
    let window_height = window.innerHeight;

    main_content.style.height = window_height - menubar_height_int + "px";
}

// Update main content div to window height
window.addEventListener('resize', resizeWindow);

resizeWindow();