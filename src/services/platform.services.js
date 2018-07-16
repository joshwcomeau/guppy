const os = window.require('os');
const path = window.require('path');

// Returns true if the OS is Windows
export const isWin = () => /^win/.test(os.platform());

// Returns path to the users Documents direactory
export const getWindowsHomeDir = () => {
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
  const winDocPath = winDocumentsPathArray[winDocPathArray.length - 1]
    .replace('%USERPROFILE%\\', '')
    .replace(/\s/g, '');
  return path.join(os.homedir(), winDocPath);
};

// Placeholder for command formatter
export const formatCommandForPlatform = () => {};
