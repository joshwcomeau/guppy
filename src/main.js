/**
 * This is our main Electron process.
 * It handles opening our app window, and quitting the application.
 */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fixPath = require('fix-path');
const chalkRaw = require('chalk');

const killProcessId = require('./services/kill-process-id.service');
const electronStore = require('./services/electron-store.service');

const chalk = new chalkRaw.constructor({ level: 3 });

// In production, we need to use `fixPath` to let Guppy use NPM.
// For reasons unknown, the opposite is true in development; adding this breaks
// everything.
if (process.env.NODE_ENV !== 'development') {
  fixPath();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Guppy is primarily a process runner, and so many processes may be started.
// To ensure that Guppy cleans up after itself, we'll store all of the spawned
// process IDs up here in the main process, so that we can terminate them all
// before the app quits.
let processIds = [];

const MOVE_TO_APP_FOLDER_KEY = 'leave-application-in-original-location';

function createWindow() {
  // Verifies if Guppy is already in the Applications folder
  // and prompts the user to move it if it isn't
  manageApplicationLocation();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 768,
    minWidth: 777,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'assets/icons/png/256x256.png'),
  });

  // set up some chrome extensions
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REACT_PERF,
  } = require('electron-devtools-installer');

  require('electron-debug')({ showDevTools: true });

  const ChromeLens = {
    // ID of the extension (https://chrome.google.com/webstore/detail/chromelens/idikgljglpfilbhaboonnpnnincjhjkd)
    id: 'idikgljglpfilbhaboonnpnnincjhjkd',
    electron: '>=1.2.1',
  };

  const extensions = [REACT_DEVELOPER_TOOLS, REACT_PERF, ChromeLens];

  for (const extension of extensions) {
    try {
      installExtension(extension);
    } catch (e) {
      console.error(chalk.red(`[ELECTRON] Extension installation failed`), e);
    }
  }

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  mainWindow.loadURL(startUrl);

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
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', ev => {
  if (processIds.length) {
    ev.preventDefault();
    killAllRunningProcesses();
    app.quit();
  }
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

ipcMain.on('killAllRunningProcesses', event => {
  killAllRunningProcesses();
});

const killAllRunningProcesses = () => {
  try {
    processIds.forEach(processId => {
      killProcessId(processId);

      // Remove the parent or any children PIDs from the list of tracked
      // IDs, since they're killed now.
      processIds = processIds.filter(id => id !== processId);
    });
  } catch (err) {
    console.error('Got error when trying to kill children', err);
  }
};

const canApplicationBeMoved = () => {
  // The application can be moved if :
  //  - The platform is MacOS
  //  - The function 'isInApplicationsFolder' exists
  //  - The app is running in production
  //  - Guppy is not already in the Applications folder
  //  - The user hasn't chosen to not see the dialog prompt again
  const hasApplicationsFolder =
    process.platform === 'darwin' &&
    typeof app.isInApplicationsFolder === 'function';

  // NOTE: Because this file isn't compiled by Webpack, `process.env.NODE_ENV`
  // will be undefined in the bundled application. Rather than check to see if
  // it's set to `production`, we just care that it ISN'T set to `development`
  // (development is set in package.json when running the 'start' script).
  const isProduction = process.env.NODE_ENV !== 'development';

  if (
    hasApplicationsFolder &&
    isProduction &&
    !app.isInApplicationsFolder() &&
    !electronStore.has(MOVE_TO_APP_FOLDER_KEY)
  ) {
    return true;
  }

  return false;
};

const manageApplicationLocation = () => {
  if (canApplicationBeMoved()) {
    dialog.showMessageBox(
      {
        type: 'question',
        buttons: ['Yes, move to Applications', 'No thanks'],
        message: 'Move to Applications folder?',
        detail:
          "I see that I'm not in the Applications folder. I can move myself there if you'd like!",
        icon: path.join(__dirname, 'assets/icons/png/256x256.png'),
        cancelId: 1,
        defaultId: 0,
        checkboxLabel: 'Do not show this message again',
      },
      (res, checkboxChecked) => {
        // User wants the application to be moved
        if (res === 0) {
          try {
            app.moveToApplicationsFolder();
          } catch (err) {
            dialog.showErrorBox(
              'Error',
              'Could not move Guppy to the Applications folder'
            );
            console.error(
              'Could not move Guppy to the Applications folder',
              err
            );
          }
        }

        // User doesn't want to see the message again
        if (checkboxChecked === true) {
          electronStore.set(MOVE_TO_APP_FOLDER_KEY, true);
        }
      }
    );
  }
};
