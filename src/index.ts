import { app, BrowserWindow, Menu, Tray, shell, MenuItem } from "electron";
import { ipcMain as ipc } from "electron-better-ipc";
import * as path from "path";
import * as fs from "fs-extra";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

if (process.env.NODE_ENV == "development") {
  try {
    require("electron-reloader")(module);
  } catch (_) {}
}

// There can only be one window
const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
}

const isDevelopment = process.env.NODE_ENV == "development";
const settingsDirectory = path.join(app.getPath("userData"), "settings");

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let config: Config | null = null;

function initialize() {
  loadConfig();
  createTray();
  createWindow();
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "../dist/preload.js"),
      nodeIntegration: true
    }
  });
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.maximize();
  mainWindow.show();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));
  if (isDevelopment) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, "../assets/neko.png"));

  let catSpawnButtons = config!.nekos.map(nekoConfig => {
    return {
      label: nekoConfig.name,
      type: "normal",
      click: (menuItem, browserWindow, event) => {
        ipc.sendToRenderers("spawn-neko", nekoConfig);
      }
    } as Electron.MenuItemConstructorOptions;
  });

  const contextMenu = Menu.buildFromTemplate([
    { type: "separator" },
    ...catSpawnButtons,
    { type: "separator" },
    {
      label: "Open Nekos",
      type: "normal",
      click: (menuItem, browserWindow, event) => {
        shell.showItemInFolder(config!.nekosDirectory);
      }
    },
    { type: "separator" },
    { role: "quit" }
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}

function loadConfig() {
  config = {
    settingsDirectory: settingsDirectory,
    nekosDirectory: path.join(settingsDirectory, "nekos"),
    nekos: []
  };

  fs.ensureDirSync(config.settingsDirectory);
  fs.ensureDirSync(config.nekosDirectory);

  // Copy over the nekos
  fs.readdirSync(path.join(__dirname, "../assets/nekos"), {
    withFileTypes: true
  })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      let sourceDirectory = path.join(
        __dirname,
        "../assets/nekos",
        dirent.name
      );
      let targetDirectory = path.join(config!.nekosDirectory, dirent.name);
      if (!fs.existsSync(targetDirectory)) {
        fs.copySync(sourceDirectory, targetDirectory);
      }

      config!.nekos.push({
        directory: targetDirectory,
        name: dirent.name
      });
    });
}

if (hasSingleInstanceLock) {
  ipc.answerRenderer("get-config", async data => {
    return config;
  });
}

if (hasSingleInstanceLock) {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", initialize);

  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.maximize();
      }
      mainWindow.focus();

      // TODO: Spawn neko
    }
  });

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    tray = null;
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
