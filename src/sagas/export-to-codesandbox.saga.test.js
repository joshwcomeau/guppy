// @flow
import { call, cancel, take, takeEvery, select, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import electron from 'electron'; // Mocked
import { spawnProcessChannel } from './spawn.helpers';
import { spawn } from 'child_process';

import { getSelectedProject } from '../reducers/projects.reducer';
import { getCodesandboxToken } from '../reducers/app-settings.reducer';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { formatCommandForPlatform } from '../services/platform.service';
import {
  EXPORT_TO_CODESANDBOX_START,
  CODESANDBOX_LOGOUT,
  setCodesandboxUrl,
  exportToCodesandboxStart,
  exportToCodesandboxFinish,
} from '../actions';
import { sendCommandToProcess } from './task.saga'; // todo move command to shell.service? Or do we have another location that would fit?

import rootSaga, {
  handleExport,
  handleLogout,
  watchExportMessages,
  checkMessage,
  exportSteps,
} from './export-to-codesandbox.saga';

describe('export to codesandbox saga', () => {
  describe('root export saga', () => {
    it('should watch for start actions', () => {
      const saga = rootSaga();
      expect(saga.next().value).toEqual(
        takeEvery(EXPORT_TO_CODESANDBOX_START, handleExport)
      );
      expect(saga.next().value).toEqual(
        takeEvery(CODESANDBOX_LOGOUT, handleLogout)
      );
    });
  });

  describe('export to sandbox', () => {
    it('should stop export on confirm cancel', () => {
      const saga = handleExport(exportToCodesandboxStart('a'));
      expect(saga.next().value).toEqual(select(getSelectedProject));
      expect(saga.next({ path: 'path/to/project' }).value).toEqual(
        call([electron.remote.dialog, electron.remote.dialog.showMessageBox], {
          type: 'warning',
          title: 'Exported code will be public',
          message:
            'By deploying to CodeSandbox, the code of your project will be made public.',
          buttons: ['OK, export project', 'Cancel'],
        })
      );
      expect(saga.next(1).value).toEqual(put(exportToCodesandboxFinish('a')));
      expect(saga.next().value).toEqual(cancel());
    });

    it('should start export', () => {
      const saga = handleExport(exportToCodesandboxStart('a'));
      saga.next(); // skip project select (already tested)
      expect(saga.next({ path: 'path/to/project' }).value).toEqual(
        call([electron.remote.dialog, electron.remote.dialog.showMessageBox], {
          type: 'warning',
          title: 'Exported code will be public',
          message:
            'By deploying to CodeSandbox, the code of your project will be made public.',
          buttons: ['OK, export project', 'Cancel'],
        })
      );

      expect(saga.next().value).toEqual(
        call(
          spawnProcessChannel,
          formatCommandForPlatform('codesandbox'),
          ['.'],
          'path/to/project',
          'CODESANDBOX:EXPORT'
        )
      );
      expect(saga.next().value).toEqual(
        call(watchExportMessages, undefined, 'a')
      );
    });

    it('should check for errors on exit', () => {
      const channel = eventChannel(() => {
        return () => {};
      });
      const saga = watchExportMessages(channel, 'a');
      const errorMessage = '[error] An error message.';
      const result = /\[error\] (.*)/.exec(errorMessage);

      expect(saga.next().value).toEqual(take(channel));
      expect(
        saga.next({ data: { stdout: errorMessage }, exit: 0 }).value
      ).toEqual(
        call([electron.remote.dialog, electron.remote.dialog.showMessageBox], {
          type: 'error',
          title: 'Codesandbox Export Error',
          message: result && result.length > 0 ? result[1] : '',
        })
      );
      expect(saga.next(1).value).toEqual(put(exportToCodesandboxFinish('a')));
    });

    describe('watch export messages', () => {
      let channel, saga;
      beforeEach(() => {
        channel = eventChannel(() => {
          return () => {};
        });
        saga = watchExportMessages(channel, 'a');
      });

      it('should exit with exit prop', () => {
        expect(saga.next().value).toEqual(take(channel));
        expect(saga.next({ data: { stdout: '' }, exit: 0 }).value).toEqual({
          data: { stdout: '' },
          exit: 0,
        });
      });
      it('should take message for checking', () => {
        const output = { data: { stdout: '' } };
        let currentStep = 0;
        expect(saga.next().value).toEqual(take(channel));
        expect(saga.next(output).value).toEqual(
          call(checkMessage, output, currentStep)
        );
      });
    });

    describe('check codesandbox messages', () => {
      const child = spawn('echo'); // Spawn so we're having the right type here
      const project = {
        path: 'path/to/project',
        id: 'a',
      };

      const expectedHandling = i => {
        const saga = checkMessage(
          {
            data: {
              stdout: exportSteps[i].msg,
            },
            child,
          },
          i
        );
        expect(saga.next().value).toEqual(select(getCodesandboxToken));
        expect(saga.next().value).toEqual(select(getSelectedProject));
        expect(saga.next(project).value).toEqual(
          call(
            sendCommandToProcess,
            child,
            // $FlowFixMe
            exportSteps[i].response
          )
        );
      };

      for (let i = 0; i < exportSteps.length; i++) {
        it(`should handle "${exportSteps[i].msg}" message`, () =>
          expectedHandling(i));
      }

      it('should handle [success] message', () => {
        const url = 'https://codesandbox.io/s/xyz';
        const saga = checkMessage(
          {
            data: {
              stdout: `[success] ${url}`,
            },
            child,
          },
          3
        );
        expect(saga.next().value).toEqual(select(getCodesandboxToken));
        expect(saga.next().value).toEqual(select(getSelectedProject));

        // Store sandbox url in state
        expect(saga.next(project).value).toEqual(
          put(setCodesandboxUrl('a', url))
        );

        // Load package.json
        expect(saga.next().value).toEqual(call(loadPackageJson, project.path));

        // Save url in package.json
        expect(saga.next().value).toEqual(
          call(writePackageJson, project.path, {
            guppy: {
              codesandboxUrl: url,
            },
          })
        );

        expect(saga.next().value).toEqual(put(exportToCodesandboxFinish('a')));
      });

      it('should return inc', () => {
        const saga = checkMessage(
          {
            data: {
              stdout: exportSteps[0].msg,
            },
            child,
          },
          0
        );
        expect(saga.next().value).toEqual(select(getCodesandboxToken));
        expect(saga.next().value).toEqual(select(getSelectedProject));
        saga.next(project);

        expect(saga.next().value).toEqual('inc');
      });
      it('should return index of last message', () => {
        const saga = checkMessage(
          {
            data: {
              stdout: exportSteps[3].msg,
            },
            child,
          },
          2
        );
        expect(saga.next('token').value).toEqual(select(getCodesandboxToken));
        expect(saga.next(project).value).toEqual(select(getSelectedProject));
        expect(saga.next(project).value).toEqual(
          call(sendCommandToProcess, child, exportSteps[3].response)
        );

        expect(saga.next().value).toEqual(3);
      });
    });
  });
});
