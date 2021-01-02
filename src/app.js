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
    tool: pathAction("./src/tool"),
    icon: {svg: "./src/dump/QuestHomesLogo.png"}
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
                icon: windows.icon.svg,
                webPreferences: {
                    devTools: true,
                    nodeIntegration: true,
                    enableRemoteModule: true,
                    nativeWindowOpen: true
                },
            },
        ), state.window.loadFile(path);
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
    let tool = {
        label: "builder",
        click() {window(windows.tool.html)}
    }
    let dev = {
        label: "dev",
        submenu: createSeparators([{label: "console", click() {state.window.webContents.openDevTools();}}])
    };
    template.push(tool)
    if (opts.dev){template.push(dev)};
    let BuiltMenu = electron.Menu.buildFromTemplate(createSeparators(template));
    electron.Menu.setApplicationMenu(BuiltMenu);
};