/* eslint-disable flowtype/require-valid-file-annotation */
/**
 * This is our main Electron process.
 * It handles opening our app window, and quitting the application.
 */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const url = require('url');
const chalkRaw = require('chalk');

const killProcessId = require('./services/kill-process-id.service');
const electronStore = require('./services/electron-store.service');

const chalk = new chalkRaw.constructor({ level: 3 });
let icon256Path = '../public/256x256.png';

// In development, check if babel is compiling down to the right Chromium version
if (process.env.NODE_ENV === 'development') {
  const currentChromeVersion = process.versions.chrome.split('.')[0];
  const chromeVersionWeBuildFor = require('../package.json').browserslist.split(
    'chrome '
  )[1];
  if (currentChromeVersion !== chromeVersionWeBuildFor) {
    log.warn(
      `The Chromium version that Guppy is compiled for does not match the Chromium version used by Electron. You should update the \`browserslist\` field in the package.json to \`"chrome ${currentChromeVersion}"\`.`
    );
  }
}

if (process.env.NODE_ENV !== 'development') {
  icon256Path = '../build/256x256.png';
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Guppy is primarily a process runner, and so many processes may be started.
// To ensure that Guppy cleans up after itself, we'll store all of the spawned
// process IDs up here in the main process, so that we can terminate them all
// before the app quits.
let processIds = [];

// Used for renderer tasks on close (emitting event app-will-close once)
let emitAppWillClose = true;

const MOVE_TO_APP_FOLDER_KEY = 'leave-application-in-original-location';

// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// default logs from electron-updater are
// 'Checking for update', 'Found verison ...', 'Downloading update ...'

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  };

  dialog.showMessageBox(dialogOpts, response => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});

function createWindow() {
  // Check if there is a newer version
  autoUpdater.checkForUpdatesAndNotify();

  // Verifies if Guppy is already in the Applications folder
  // and prompts the user to move it if it isn't
  manageApplicationLocation();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 768,
    minWidth: 777,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, icon256Path),
  });

  // set up some chrome extensions
  if (process.env.NODE_ENV === 'development') {
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

  mainWindow.on('close', e => {
    if (emitAppWillClose) {
      emitAppWillClose = false;
      mainWindow.webContents.send('app-will-close');
      e.preventDefault();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  attachIpcMainListeners(ipcMain);
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

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function attachIpcMainListeners(ipcMainHandle, notifyCallback) {
  // Notify is used for testing the ipc calls
  const notify = (evt, data) => {
    if (notifyCallback) notifyCallback(evt, data);
  };

  ipcMainHandle.on('addProcessId', (event, processId) => {
    processIds.push(processId);
    notify('addProcessId', processIds);
  });

  ipcMainHandle.on('removeProcessId', (event, processId) => {
    processIds = processIds.filter(id => id !== processId);
    notify('removeProcessId', processIds);
  });

  ipcMainHandle.on('killAllRunningProcesses', async event => {
    if (processIds.length) {
      await killAllRunningProcesses();
    }
    app.quit();
    notify('killAllRunningProcesses', processIds);
  });

  ipcMainHandle.on('triggerClose', (e, proceed) => {
    if (!proceed) {
      // user aborted
      emitAppWillClose = true; // reset flag
      return;
    }

    mainWindow.close();
  });
}

const killAllRunningProcesses = async () => {
  try {
    await Promise.all(
      processIds.map(processId => {
        // Remove the parent or any children PIDs from the list of tracked
        // IDs, since they're killed now.
        processIds = processIds.filter(id => id !== processId);

        return killProcessId(processId);
      })
    );
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

  if (
    hasApplicationsFolder &&
    app.isPackaged &&
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
        icon: path.join(__dirname, icon256Path),
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

// exports used for unit tests
module.exports = {
  attachIpcMainListeners,
};
