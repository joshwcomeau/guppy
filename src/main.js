/**
 * This is our main Electron process.
 * It handles opening our app window, and quitting the application.
 */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const childProcess = require('child_process');

const psTree = require('ps-tree');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Guppy is primarily a process runner, and so many processes may be started.
// To ensure that Guppy cleans up after itself, we'll store all of the spawned
// process IDs up here in the main process, so that we can terminate them all
// before the app quits.
let processIds = [];

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    titleBarStyle: 'hidden',
  });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // We want to be a good samaritan and clean up any processes spawned.
  // This is made slightly more complex by the fact that processes can have
  // sub-processes (eg. running a dev server spawns a 'shell' process, but we
  // actually want to kill the child `node` process).
  const processKillingPromises = processIds.map(
    processId =>
      new Promise((resolve, reject) =>
        psTree(processId, (err, children) => {
          if (err) {
            return reject(err);
          }

          if (!children || children.length === 0) {
            return resolve();
          }

          const childrenPIDs = children.map(child => child.PID);

          childProcess.spawnSync('kill', ['-9', ...childrenPIDs]);

          resolve();
        })
      )
  );

  Promise.all(processKillingPromises)
    .then(() => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    })
    .catch(err => {
      console.error('Got error when trying to kill children', err);
    });
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('addProcessId', (event, processId) => {
  processIds.push(processId);
});

ipcMain.on('removeProcessId', (event, processId) => {
  processIds = processIds.filter(id => id !== processId);
});
