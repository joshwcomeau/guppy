// @flow
import * as childProcess from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { remote } from 'electron';
import { PACKAGE_MANAGER } from '../config/app';

const { app } = remote;

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

// Here we're checking if node is available in system path.
// If not we're using the bundled node version.
// Todo: Is a version check required? See issue #322
//       Is 'fix-path' still required?
export const initializePath = () => {
  // Check synchronously if node is available so we can use the return value in binaryPaths constant
  let version;
  try {
    version = childProcess.execSync('node -v', { env: window.process.env });
  } catch (e) {
    // e.g. Node not found in path
    if (!e.message.includes('Command failed')) {
      console.log(e); // swallow command failed error --> if other error console.log it here
    }
  }

  if (version) {
    // Later check if it's meeting the minimum requirements - if not warn user & load bundled node
    // for now always use system node if available
    console.log('found node version', version.toString());
    return {
      systemNodeUsed: true,
      nodePath: '',
      npmPath: '',
      yarnPath: '',
    };
  }

  // Use bundled Yarn & Node
  console.log(app.getAppPath());
  const appPath = app.getAppPath().replace('app.asar', 'app.asar.unpacked');
  const nodePath = path.join(appPath, './node_modules', 'node', 'bin');
  const npmPath = path.join(appPath, './node_modules', 'npm', 'bin'); // also includes npx
  const yarnPath = path.join(appPath, './node_modules', 'yarn', 'bin');

  // Add our Node version to path (so Yarn can find it)
  const pathKey = isWin ? 'Path' : 'PATH';

  window.process.env = {
    [pathKey]: nodePath + path.delimiter + npmPath, // Add our Node & npm on path so Yarn can find it
  };

  // Link npm to bundled Node
  // usually linked to C:\\Program Files\\nodejs on Windows
  // but overidden to C:\Users\Alexander\AppData\Roaming\npm -- so global packages are installed there (not needed here)
  // Todo: Do we need to wrap it in a try/catch block?
  // childProcess.execSync('npm config set prefix ' + nodePath, {
  //   env: window.process.env,
  // });

  return {
    systemNodeUsed: false,
    nodePath,
    npmPath,
    yarnPath,
  };
};

export const binaryPaths = initializePath();

// Returns formatted command for Windows
export const formatCommandForPlatform = (command: string): string =>
  isWin ? `${command}.cmd` : command;

export const PACKAGE_MANAGER_CMD = path.join(
  binaryPaths.yarnPath,
  formatCommandForPlatform(PACKAGE_MANAGER)
);

// Forward the host env, and append the
// project's .bin directory to PATH to allow
// package scripts to function properly.
/**
 * For running tasks in a cross-platform manner, this helper does a few things:
 *  - Forward the host environment
 *  - Append the project's .bin directory to PATH to allow package scripts to
 *    function properly.
 *  - Add `FORCE_COLOR: true`, so that terminal output includes color codes.
 */
export const getBaseProjectEnvironment = (
  projectPath: string,
  currentEnvironment: Object = window.process.env
) => {
  const pathKey = isWin ? 'Path' : 'PATH';

  return {
    ...currentEnvironment,
    // NOTE: `FORCE_COLOR` adds control characters to the output.
    // If at some point we need "raw" output with no control characters, we
    // should move this out into a "wrapping" function, and update current
    // callsites to use it.
    FORCE_COLOR: true,
    [pathKey]:
      currentEnvironment[pathKey] +
      path.join(projectPath, 'node_modules', '.bin', path.delimiter),
  };
};

export const getCopyForOpeningFolder = () =>
  // For Mac users, use the more-common term 'Finder'.
  // For Windows and Linux users, 'folder' should be meaningful enough.
  isMac ? 'Open in Finder' : 'Open folder';
