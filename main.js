const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require("fs");

const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;

let appWindow;
let file_path;

const appMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator:process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() {
                    file_path = dialog.showOpenDialog({ filters: [{ name: "Text File", extensions: 'txt' }] }, { properties: ['openFile', 'openDirectory'] });
                    fs.readFile(file_path[0], "utf8", function (error, data) {
                            if (error) throw error;
                            appWindow.webContents.send('file:load', data);
                        });
                }
            },
            {
                label: 'Save',
                accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click() {
                    appWindow.webContents.send('file:save');
                }
            },
            {
                label: 'Quit',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

app.on('ready', () => {
    appWindow = new BrowserWindow({});

    appWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'appWindow.html'),
        protocol: "file:",
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(appMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    appWindow.on('close', () => app.quit());
})

ipcMain.on("save", (e, data) => {
    fs.writeFileSync(file_path[0], data.split("\n").join('\r\n'));
})