const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const { ipcMain, webFrame, Menu, webContents } = require('electron');
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');
const url = require('url');

const unhandled = require('electron-unhandled');

unhandled();

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 350,
    height: 250,
    minHeight: 250,
    maxHeight: 250,
    maxWidth: 350,
    minWidth: 350,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true);
  win.setHasShadow(false);
  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(isDev ? 'http://localhost:3000' : url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
      }));
  // win.webFrame.setZoomFactor(0.1);
  
  win.webContents.once('dom-ready', async () => {
    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err))
      .finally(() => {
        // win.webContents.openDevTools();
      });
      // setMainMenu()
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

function setMainMenu() {
  const template = [
    {
      label: 'Settings',
      subMenu: [
        {
          role: 'Info & Settings',
        },
      ],
      label: 'Settingss', 
      subMenu: [
        {
          role: 'Info & Setstings',
        },
      ],
    },
   
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
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
  const windows = BrowserWindow.getAllWindows();

  if (windows.length < 2) {
    openModal();
  } else {
    windows[0].show();
  }
});

ipcMain.on('zoom-out', () => {
  // Get the current web contents
  const currentWebContents = webContents.getFocusedWebContents()

  if (currentWebContents.zoomFactor !== 0.9) {
  // Zoom out to 90% - this exists because I'm silly and developed it at 90% rather than full size. 
    currentWebContents.zoomFactor = 0.9 
  }
})

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
      ? 'http://localhost:3000'
      : 
      `file://${path.join(__dirname, '../build/index.html')}`
  );
  child.webContents.on('did-finish-load', () => {
    child.show();
  });
}
