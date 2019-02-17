/* eslint-disable flowtype/require-valid-file-annotation */
const { ipcRenderer, ipcMain } = require('electron-ipc-mock')();

jest.doMock('electron', () => ({
  ipcRenderer,
  ipcMain,
  app: {
    on: jest.fn(),
  },
}));

const { processIds } = require('./electron');

/* Note: We could do more tests here but for now I'm focusing on taskkill on app close
         Possible things to test:
         - auto-updating dialog
         - move to app folder (Mac)
*/

describe('Main electron app', () => {
  describe('Kill tasks on app close', () => {
    xit('should add process id (ipcMain)', () => {
      const mockAddProcess = jest.fn();
      ipcMain.on('addProcessId', mockAddProcess);

      ipcRenderer.send('addProcessId', 1);
      expect(mockAddProcess).toHaveBeenCalledWith(1);
      // expect(mockAddProcess).toBeCalledWith(expect.any(Event), 0);
      // expect(processIds).toHaveLength(1);
    });

    xit('should remove process id (ipcMain)', () => {});

    xit('should kill all running processes (ipcMain)', () => {});
    // Todo: should we test that app-will-close will be send on close to renderer?
  });
});
