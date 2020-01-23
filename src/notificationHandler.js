const {ipcRenderer} = require('electron');
const path = require('path');

const enterworktimenotification = {
    title: 'Break Free Alert',
    body: 'Entered Worktime',
    icon: path.join(__dirname, '../assets/images/logos/logo-icon.png')
}

const breaktimenotification = {
    title: 'Break Free Alert',
    body: 'Time for a break!',
    icon: path.join(__dirname, '../assets/images/logos/logo-icon.png')
}

ipcRenderer.on("enterworktime", (event, arg) => {
        console.log("Sending notification");
        const myNotification = new window.Notification(enterworktimenotification.title, enterworktimenotification);
});

ipcRenderer.on("breaktime", (event, arg) => {
    const myNotification = new window.Notification(breaktimenotification.title, breaktimenotification);
});

ipcRenderer.on("blacklistedwindow", (event, arg) => {
    const blacklistedwindownotification = {
        title: 'Break Free Alert',
        body: `Blacklisted window found: "${arg}"`,
        icon: path.join(__dirname, '../assets/images/logos/logo-icon.png')
    }

    const myNotification = new window.Notification(blacklistedwindownotification.title, blacklistedwindownotification);
});

ipcRenderer.on("blacklistedtag", (event, arg) => {
    const blacklistedtagnotification = {
        title: 'Break Free Alert',
        body: `Blacklisted keyword found: "${arg}"`,
        icon: path.join(__dirname, '../assets/images/logos/logo-icon.png')
    }

    const myNotification = new window.Notification(blacklistedtagnotification.title, blacklistedtagnotification);
});