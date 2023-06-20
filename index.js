const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1550,
        height: 1100,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    mainWindow.loadURL(`file://${__dirname}/build/index.html`);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
});

ipcMain.on('response', (event, value) => {
    console.log(value);
});

ipcMain.on('error', (event, value) => {
    console.log(value);
});