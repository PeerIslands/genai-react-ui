const path = require('path');
const { app, BrowserWindow } = require('electron');
const { initialize: initializeRemote } = require('@electron/remote/main');

app.setName('MongoDB Query Builder');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1550,
        height: 1100,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    mainWindow.loadURL('http://localhost:3000');
    // and load the index.html of the app.
    var splash = new BrowserWindow({
        width: 700,
        height: 500,
        transparent: true,
        frame: false,
        alwaysOnTop: true
    });

    splash.loadFile(path.join(__dirname, 'splash.html'));
    splash.center();
    setTimeout(function () {
        splash.close();
        mainWindow.center();
        mainWindow.show();
    }, 5000);


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    initializeRemote();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
