const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
require('dotenv').config();

let mainWindow

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        gtitle: "GenAI MongoDB App",
        width: 1500,
        height: 1000,
        // transparent: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })

    //load the index.html from a url
    win.loadURL('http://localhost:3000');

    // Open the DevTools.
    // win.webContents.openDevTools()
}
app.disableHardwareAcceleration();
app.on('ready', createWindow)
