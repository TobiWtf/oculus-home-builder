let pathAction = path => {
    return {
        path: path,
        html: path + "/window.html",
        css: path + "/window.css"
    };
};

const electron = require("electron");
const state = {};
const windows =     {
    main: pathAction("./src/main"),
};

if (require('electron-squirrel-startup')) {
    electron.app.quit();
};


var window = async (path=windows.main.html) => {
    if (!state.window) {
        state.window = new electron.BrowserWindow(
            {
                width: 800,
                height: 600,
                resizable: false,
                webPreferences: {
                    devTools: true,
                    nodeIntegration: true,
                    enableRemoteModule: true,
                    nativeWindowOpen: true
                },
            },
        ), state.window.loadFile(path);
        console.log(path)
    } else {
        state.window.loadFile(path);
    };
};

electron.app.on(
    "ready",
    async () => {
        window(), menu();
    },
);

const createSeparators = (listOfLabels) => {
    let separator = {type: "separator"};
    let finalMenu = [];
    finalMenu.push(separator);
    for (let index in listOfLabels) {finalMenu.push(listOfLabels[index]), finalMenu.push(separator)};
    finalMenu.push(separator);
    return finalMenu
};

const menu = (opts={dev: true}, template=[]) => {
    let dev = {
        label: "dev",
        submenu: createSeparators([{label: "console", click() {state.window.webContents.openDevTools();}}])
    };
    if (opts.dev){template.push(dev)};
    let BuiltMenu = electron.Menu.buildFromTemplate(createSeparators(template));
    electron.Menu.setApplicationMenu(BuiltMenu);
};