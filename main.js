const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let appWindow;

const appMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open'
            },
            {
                label: 'Save'
            },
            {
                label: 'Quit',
                click(){
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