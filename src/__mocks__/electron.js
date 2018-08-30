import * as path from 'path';

module.exports = {
  ipcRenderer: {
    send: jest.fn(),
  },
  remote: {
    app: {
      getAppPath: () => path.resolve(__dirname, '..', '..', '..'),
      getPath: () =>
        process.env.APPDATA ||
        (process.platform === 'darwin'
          ? process.env.HOME + 'Library/Preferences'
          : '/var/local'),
    },
    dialog: {
      showErrorBox: jest.fn(),
      showOpenDialog: jest.fn(),
      showMessageBox: jest.fn(),
    },
    shell: {
      moveItemToTrash: jest.fn(),
    },
  },
};
