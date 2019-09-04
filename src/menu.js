const electron = require('electron');
const remote = electron.remote;

const minimize_button = document.getElementById("minimize-button");
const maximize_button = document.getElementById("maximize-button");
const close_button = document.getElementById("close-button");

// Minimize Function
minimize_button.addEventListener('click', () => {
    let window = remote.getCurrentWindow();
    window.minimize();
});

// Maximize Function
maximize_button.addEventListener('click', () => {
    let window = remote.getCurrentWindow();

    if(window.isMaximized()){
        window.unmaximize();
    }else{
        window.maximize();
    }
    
});

// Close Function
close_button.addEventListener('click', () => {
    let window = remote.getCurrentWindow();
    window.close();
});