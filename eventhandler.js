const { ipcMain } = require('electron');

ipcMain.on("enteredworktime", (event, arg) => {
    event.reply("enterworktime", arg);
});

ipcMain.on("enteredbreaktime", (event, arg) => {
    event.reply("breaktime", arg);
});

ipcMain.on("blacklistedwindowfound", (event, arg) => {
    event.reply("blacklistedwindow", arg);
});

ipcMain.on("blacklistedtagfound", (event, arg) => {
    event.reply("blacklistedtag", arg);
});