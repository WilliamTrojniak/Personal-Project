const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Set the minimum window size
  win.setMinimumSize(850, 420);

  // and load the index.html of the app.
  win.loadURL(url.format({
      pathname: path.join(__dirname, 'src/index.html'),
      protocol: 'file',
      slashes: true
  }));

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.setAppUserModelId(process.execPath);

require('./eventhandler');
