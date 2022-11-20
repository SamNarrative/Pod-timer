const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const { ipcMain } = require('electron');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 350,
    height: 220,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true);
  win.setHasShadow(false);
  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000/main'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.minimize();
  }
});

ipcMain.on('openInfo', () => {

  openModal();
});

function openModal() {
  const win = BrowserWindow.getFocusedWindow();

  const child = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    width: 550,
    height: 700,
    minHeight: 700,
    maxHeight: 700,
    maxWidth: 550,
    minWidth: 550,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    

    modal: true,
    show: false,
  });

  child.loadURL(
    isDev
      ? 'http://localhost:3000/info'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  child.webContents.on('did-finish-load', () => {
    child.show();
  });
}
