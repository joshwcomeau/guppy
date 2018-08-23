// @flow
import * as childProcess from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { remote } from 'electron';

import { PACKAGE_MANAGER } from '../config/app';

export const isWin = /^win/.test(os.platform());
export const isMac = /darwin/.test(os.platform());

// Returns path to the user's `Documents` directory
// For Windows Support
// Documents folder is much better place for project
// folders (Most programs use it as a default save location)
// Since there is a chance of being moved or users language
// might be different we are reading the value from Registry
// There might be a better solution but this seems ok so far
let winDocPath = '';
if (isWin) {
  const winDocumentsRegRecord = childProcess.execSync(
    'REG QUERY "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v Personal',
    {
      encoding: 'utf8',
    }
  );
  const winDocPathArray = winDocumentsRegRecord.split(' ');
  winDocPath = winDocPathArray[winDocPathArray.length - 1]
    .replace('%USERPROFILE%\\', '')
    .replace(/\s/g, '');
}
export const windowsHomeDir = isWin ? path.join(os.homedir(), winDocPath) : '';

// Returns formatted command for Windows
export const formatCommandForPlatform = (command: string): string =>
  isWin ? `${command}.cmd` : command;

export const PACKAGE_MANAGER_CMD = path.join(
  remote.app.getAppPath(),
  './node_modules/yarn/bin',
  formatCommandForPlatform(PACKAGE_MANAGER)
);
