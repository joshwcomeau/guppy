/* eslint-disable flowtype/require-valid-file-annotation */

/* Note: We could do more tests here but for now I'm focusing on taskkill on app close
Possible things to test:
- auto-updating dialog
- move to app folder (Mac)
*/
jest.mock('./services/kill-process-id.service');

const killProcessId = require('./services/kill-process-id.service');

describe('Main electron app', () => {
  describe('Kill tasks on app close', () => {
    // Note: It would be better to use ipcMain events instead of a notify callback
    //       but I haven't found a way to do it as mocking ipcMain.on will override
    //       the behaviour we'd like to test.
    //       NotifyCallback is working but it's adding one untested
    //       line to electron.js
    let attachIpcMainListeners;
    let mockedIpcRenderer, mockedIpcMain;
    let app;

    beforeEach(() => {
      const mockedIpc = require('electron-ipc-mock')();
      mockedIpcRenderer = mockedIpc.ipcRenderer;
      mockedIpcMain = mockedIpc.ipcMain;

      jest.mock('electron', () => ({
        ipcRenderer: mockedIpcRenderer,
        ipcMain: mockedIpcMain,
        app: {
          on: jest.fn(),
          quit: jest.fn(),
        },
      }));

      attachIpcMainListeners = require('./electron').attachIpcMainListeners;
      app = require('electron').app;
    });

    it('should add process id (ipcMain)', done => {
      const notify = (eventName, processIds) => {
        expect(processIds).toHaveLength(1);
        expect(processIds[0]).toBe(1);
        done();
      };

      attachIpcMainListeners(mockedIpcMain, notify);
      mockedIpcRenderer.send('addProcessId', 1);
    });

    it('should remove process id (ipcMain)', done => {
      const notify = (eventName, processIds) => {
        if (eventName === 'removeProcessId') {
          expect(processIds).toHaveLength(0);
          done();
        }
      };

      attachIpcMainListeners(mockedIpcMain, notify);
      mockedIpcRenderer.send('addProcessId', 1);
      mockedIpcRenderer.send('removeProcessId', 1);
    });

    it('should kill all running processes (ipcMain)', done => {
      const notify = (eventName, processIds) => {
        if (eventName === 'killAllRunningProcesses') {
          expect(processIds).toHaveLength(0); // killed ids are removed
          expect(killProcessId).toHaveBeenCalledTimes(2);
          expect(app.quit).toHaveBeenCalled();
          done();
        }
      };

      attachIpcMainListeners(mockedIpcMain, notify);
      mockedIpcRenderer.send('addProcessId', 1);
      mockedIpcRenderer.send('addProcessId', 2);
      mockedIpcRenderer.send('killAllRunningProcesses');
    });

    // Todo: should we test that app-will-close will be send on close to renderer?
  });
});
