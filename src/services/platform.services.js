import { PACKAGE_MANAGER } from '../config/app';
const childProcess = window.require('child_process');
const os = window.require('os');
const path = window.require('path');
const { remote } = window.require('electron');

// Returns true if the OS is Windows
export const isWin = (): boolean => /^win/.test(os.platform());

// Returns path to the users Documents direactory
export const getWindowsHomeDir = (): string => {
  // For Windows Support
  // Documents folder is much better place for project folders (Most programs use it as a default save location)
  // Since there is a chance of being moved or users language might be differet we are reading the value from Registery
  // There might be a better solution but this seems ok so far

  const winDocumentsRegRecord = childProcess.execSync(
    'REG QUERY "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v Personal',
    {
      encoding: 'utf8',
    }
  );

  const winDocPathArray = winDocumentsRegRecord.split(' ');
  const winDocPath = winDocPathArray[winDocPathArray.length - 1]
    .replace('%USERPROFILE%\\', '')
    .replace(/\s/g, '');
  return path.join(os.homedir(), winDocPath);
};

// Returns formatted command for Windows
export const formatCommandForPlatform = (command: string): string =>
  isWin() ? `${command}.cmd` : command;

// Returns PATH for Windows
export const getPathForPlatform = (): string =>
  isWin()
    ? `${remote.app.getPath(
        'appData'
      )}\\npm;C:\\Program Files\\nodejs;C:\\Program Files (x86)\\Yarn\\bin`
    : '';

export const PACKAGE_MANAGER_CMD = formatCommandForPlatform(PACKAGE_MANAGER);
