const electron = require('electron');
const { app, BrowserWindow } = electron;

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
