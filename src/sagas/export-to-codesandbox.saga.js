// @flow
// import { channel } from 'redux-saga';
import {
  call,
  fork,
  cancel,
  select,
  put,
  take,
  takeEvery,
} from 'redux-saga/effects';
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
  EXPORT_TO_CODESANDBOX,
  CODESANDBOX_LOGOUT,
  setCodesandboxUrl,
  updateCodesandboxToken,
} from '../actions';

const { dialog } = remote;

export function* handleExport({ projectPath }): Saga<void> {
  console.log('handle export', projectPath);
  let args = ['.'];

  const result = yield call([dialog, dialog.showMessageBox], {
    type: 'warning',
    title: 'Exported code will be public',
    message:
      'By deploying to CodeSandbox, the code of your project will be made public.',
    buttons: ['OK, export project', 'Cancel'],
  });

  if (result === 1) {
    // abort export
    yield cancel();
  }

  // deploying to existing sandbox not supported by CLI
  // --> deploy option is picked by default and there is no option to overwrite an existing sandbox.
  // if (codesandboxUrl) {
  //   // deploy to existing sandbox --> todo add a way to create a new sandbox
  //   args.push(['deploy', codesandboxUrl]);
  // }

  const spawnChannel = yield call(
    spawnProcessChannel,
    formatCommandForPlatform('codesandbox'),
    args,
    projectPath,
    'CODESANDBOX:EXPORT'
  );

  // const chan = yield call(channel);
  yield fork(watchExportMessages, spawnChannel);
}

export function* watchExportMessages(channel: any): any {
  try {
    while (true) {
      let output = yield take(channel);
      if (!output.hasOwnProperty('exit')) {
        console.log('running');
        yield call(checkMessage, output);
      } else {
        // Yield exit code and complete stdout
        yield output;

        // Close channel manually --> emitter(END) inside spwanProcessChannel would exit too early
        channel.close();
      }
    }
  } finally {
  }
}

export function* checkMessage({ data, child }) {
  let currentStep = 0;
  const codesandboxToken = yield select(getCodesandboxToken);
  const { path: projectPath, id } = yield select(getSelectedProject);

  // exportSteps are the messages & responses for exporting to Codesandbox (same order as they occur in terminal)
  const exportSteps = [
    { msg: 'Do you want to sign in using GitHub', response: 'Y' },
    {
      // Would be good to not go to codesandbox as the user already entered the token
      // we need to open codesandbox because otherwise there won't be a question for the token
      // --> current CLI api doesn't support what we need here. A command line arg for the token would help.
      msg: 'will open CodeSandbox to finish the login process',
      response: 'Y',
    },
    { msg: 'Token:', response: codesandboxToken.toString() },
    { msg: 'proceed with the deployment', response: 'y' },
  ];
  // Check terminal output for export messages
  // We're using an object & a step counter to ensure that each output only happens once
  // otherwise there could be multiple commands.
  if (exportSteps[currentStep] && data.includes(exportSteps[currentStep].msg)) {
    yield call(sendCommandToProcess, child, exportSteps[currentStep].response);
    currentStep++;
  }

  if (data.includes(exportSteps[3].msg)) {
    // Needed if no token requested by cli as it will only ask for proceed
    yield call(sendCommandToProcess, child, exportSteps[3].response);

    // Set currentStep as we're expecting success as next output
    currentStep = 4;
  }
  // Last export step - grep url from [success] http message
  console.log('step', currentStep);
  // if (currentStep >= 4 &&
  if (data.includes('[success] http')) {
    console.log('success');
    const strippedText = stripEscapeChars(data);

    const newCodesandboxUrl = (/(http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/gim.exec(
      strippedText
    ) || [])[0];

    // info: Check that url changed not needed as it is always changing
    yield put(setCodesandboxUrl(id, newCodesandboxUrl));

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
  }

  yield currentStep;
  // child.stderr.on('data', out => {
  //   dialog.showErrorMessage('Error', 'Please check your token and try again');
  // });
}

export function* handleLogout({ projectPath }): Saga<void> {
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
      const { data, child, ...rest } = yield take(channel);
      console.log('data', data);
      output += data;
      if (!rest.hasOwnProperty('exit')) {
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
  yield takeEvery(EXPORT_TO_CODESANDBOX, handleExport);
  yield takeEvery(CODESANDBOX_LOGOUT, handleLogout);
}
