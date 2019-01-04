// @flow
// import { channel } from 'redux-saga';
import { call, cancel, select, put, take, takeEvery } from 'redux-saga/effects';
import { remote } from 'electron';
import { spawnProcessChannel } from './spawn.helpers';

import { getCodesandboxToken } from '../reducers/app-settings.reducer';
import { getSelectedProject } from '../reducers/projects.reducer';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { formatCommandForPlatform } from '../services/platform.service';
import { sendCommandToProcess } from './task.saga'; // todo move command to shell.service? Or do we have another location that would fit?
import { stripEscapeChars } from '../utils';

import {
  EXPORT_TO_CODESANDBOX_START,
  CODESANDBOX_LOGOUT,
  setCodesandboxUrl,
  updateCodesandboxToken,
  exportToCodesandboxStart,
  exportToCodesandboxFinish,
  logoutCodesandbox,
} from '../actions';
import type { Saga } from 'redux-saga';
import type { ReturnType } from '../actions/types';

const { dialog } = remote;

export function* handleExport({
  projectId,
}: ReturnType<typeof exportToCodesandboxStart>): Saga<void> {
  let args = ['.'];
  const { path: projectPath } = yield select(getSelectedProject);
  const result = yield call([dialog, dialog.showMessageBox], {
    type: 'warning',
    title: 'Exported code will be public',
    message:
      'By deploying to CodeSandbox, the code of your project will be made public.',
    buttons: ['OK, export project', 'Cancel'],
  });

  if (result === 1) {
    yield put(exportToCodesandboxFinish(projectId));
    // abort export
    yield cancel();
  }

  // deploying to existing sandbox not supported by CLI
  // --> deploy option is picked by default and there is no option to overwrite an existing sandbox.
  // if (codesandboxUrl) {
  //   // deploy to existing sandbox --> todo add a way to create a new sandbox
  //   args.push(['deploy', codesandboxUrl]);
  // }

  const channel = yield call(
    spawnProcessChannel,
    formatCommandForPlatform('codesandbox'),
    args,
    projectPath,
    'CODESANDBOX:EXPORT'
  );

  yield call(watchExportMessages, channel, projectId);
}

export function* watchExportMessages(channel: any, projectId: string): any {
  let output;
  var currentStep = 0;
  try {
    while (true) {
      output = yield take(channel);
      if (!output.hasOwnProperty('exit')) {
        const next = yield call(checkMessage, output, currentStep);

        // Modify/increment currentStep if requested by checkMessage
        // will be skipped if message requires no action.
        if (next) {
          if (next === 'inc') {
            currentStep++;
          } else if (!isNaN(next)) {
            // numeric value
            currentStep = next;
          }
        }
      } else {
        // Yield exit code and complete stdout
        if (output.data && output.data.stdout.includes('[error]')) {
          // e.g. errors:
          // - This project is too big, it contains 140 files which is more than the max of 120. (exported Gatsby project)
          // - This project is too big, it contains 56 directories which is more than the max of 50.
          yield call([dialog, dialog.showMessageBox], {
            type: 'error',
            title: 'Codesandbox Export Error',
            // $FlowFixMe
            message: /\[error\] (.*)/.exec(output.data.stdout)[1],
          });
          yield put(exportToCodesandboxFinish(projectId));
        }
        yield output;

        // Close channel manually --> emitter(END) inside spwanProcessChannel would exit too early
        channel.close();
      }
    }
  } finally {
  }
}

// exportSteps are the messages & responses for exporting to Codesandbox (same order as they occur in terminal)
export const exportSteps = [
  { msg: 'Do you want to sign in using GitHub', response: 'Y' },
  {
    // Would be good to not go to codesandbox as the user already entered the token
    // we need to open codesandbox because otherwise there won't be a question for the token
    // --> current CLI api doesn't support what we need here. A command line arg for the token would help.
    msg: 'will open CodeSandbox to finish the login process',
    response: 'Y',
  },
  { msg: 'Token:', response: (token: string) => token.toString() },
  { msg: 'proceed with the deployment', response: 'y' },
];

export function* checkMessage({ data, child }: any, currentStep: number): any {
  const codesandboxToken = yield select(getCodesandboxToken);
  const { path: projectPath, id: projectId } = yield select(getSelectedProject);
  let next: string | number;

  // Check terminal output for export messages
  // We're using an object & a step counter to ensure that each output only happens once
  // otherwise there could be multiple commands.
  if (
    exportSteps[currentStep] &&
    data.stdout.includes(exportSteps[currentStep].msg)
  ) {
    // $FlowFixMe
    yield call(sendCommandToProcess, child, exportSteps[currentStep].response);
    next = 'inc';
  }

  if (data.stdout.includes(exportSteps[2].msg)) {
    yield call(
      sendCommandToProcess,
      child,
      exportSteps[2].response(codesandboxToken)
    );

    // Set currentStep as we're expecting success as next output
    next = 3;
  }

  if (data.stdout.includes(exportSteps[3].msg)) {
    // Needed if no token requested by cli as it will only ask for proceed
    yield call(sendCommandToProcess, child, exportSteps[3].response);

    // Set currentStep as we're expecting success as next output
    next = 3;
  }
  // Last export step - grep url from [success] http message
  if (data.stdout.includes('[success] http')) {
    const strippedText = stripEscapeChars(data.stdout);

    const newCodesandboxUrl = (/(http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/gim.exec(
      strippedText
    ) || [])[0];

    // info: Check that url changed not needed as it is always changing
    yield put(setCodesandboxUrl(projectId, newCodesandboxUrl));

    let json;
    try {
      // Let's load the basic project info for the path specified, if possible.
      json = yield call(loadPackageJson, projectPath);
    } catch (err) {
      console.log('error', err);
    }

    yield call(writePackageJson, projectPath, {
      ...json,
      guppy: {
        ...(json && json.guppy),
        codesandboxUrl: newCodesandboxUrl,
      },
    });

    yield put(exportToCodesandboxFinish(projectId));
  }

  return next;
}

export function* handleLogout({
  projectPath,
}: ReturnType<typeof logoutCodesandbox>): Saga<void> {
  const channel = yield call(
    spawnProcessChannel,
    formatCommandForPlatform('codesandbox'),
    ['logout'],
    projectPath,
    'CODESANDBOX:LOGOUT'
  );
  let output;

  try {
    while (true) {
      const { data, child, exit } = yield take(channel);

      output += data;
      if (!exit) {
        if (output.includes('log out?')) {
          yield call(sendCommandToProcess, child, 'Y');
        }
      } else {
        if (
          output.includes('Succesfully logged out') ||
          output.includes('already signed out')
        ) {
          // Clear token
          yield put(updateCodesandboxToken(''));
        }
        // Yield exit code and complete stdout
        yield output;

        // Close channel manually --> emitter(END) inside spwanProcessChannel would exit too early
        channel.close();
      }
    }
  } finally {
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery(EXPORT_TO_CODESANDBOX_START, handleExport);
  yield takeEvery(CODESANDBOX_LOGOUT, handleLogout);
}
