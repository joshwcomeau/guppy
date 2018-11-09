// @flow
import { call, put, takeEvery } from 'redux-saga/effects';
import slug from 'slug';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';

import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';

import {
  saveProjectSettingsFinish,
  SAVE_PROJECT_SETTINGS_START,
  saveProjectSettingsStart,
} from '../actions';

import type { Saga } from 'redux-saga';
import type { ReturnType } from '../actions/types';

const { dialog } = remote;
const { showErrorBox } = dialog;

export function* renameFolder(
  projectPath: string,
  newPath: string
): Saga<void> {
  yield call([fs, fs.renameSync], projectPath, newPath);
}

export function* handleProjectSaveError(err: Error): Saga<void> {
  console.error('Project save error', err);

  switch (err.message) {
    case 'renaming-failed': {
      // Could be 'EPERM: operation not permitted, rename' error.
      yield call(
        showErrorBox,
        'Renaming not permitted',
        "Egad! Couldn't rename project folder. Please check that you're not blocking this action & that you're having the permission to rename the project folder."
      );
      break;
    }
    case 'loading-packageJson-failed': {
      // EPERM: operation not permitted, open
      yield call(
        showErrorBox,
        'Reading not permitted',
        "Egad! Couldn't read package.json. Please check that you're having the permission to read the directory."
      );
      break;
    }

    default: {
      yield call([console, console.error], err);
      yield call(
        showErrorBox,
        'Unknown error',
        'An unknown error has occurred. Sorry about that! Details have been printed to the console.'
      );
    }
  }
}

export function* handleSaveSettings(
  action: ReturnType<typeof saveProjectSettingsStart>
): Saga<void> {
  const { project, name, icon } = action;
  const { path: projectPath, name: oldName } = project;
  const newNameSlug = slug(name).toLowerCase();
  const parentPath = path.resolve(projectPath, '../');
  let newPath = projectPath;

  let json;
  try {
    // Let's load the basic project info for the path specified, if possible.
    json = yield call(loadPackageJson, projectPath);
  } catch (err) {
    yield call(handleProjectSaveError, new Error('loading-packageJson-failed'));
    return;
  }

  try {
    // Check if name changed
    const nameChanged = name !== oldName;
    const confirmRequired = nameChanged;

    // Rename confirmed by default
    let confirmed = true;
    if (confirmRequired) {
      const response = yield call([dialog, dialog.showMessageBox], {
        type: 'warning',
        buttons: ['Yeah', 'Nope'],
        defaultId: 1,
        cancelId: 1,
        title: 'Are you sure?',
        message: 'Do you also want to rename the project folder?',
      });
      confirmed = response === 0;
    }

    if (confirmed && nameChanged) {
      newPath = path.join(parentPath, newNameSlug);
      try {
        yield call(renameFolder, projectPath, newPath);
      } catch (err) {
        throw new Error('renaming-failed');
      }
    }

    // Apply changes to packageJSON
    const newProject = yield call(writePackageJson, newPath, {
      ...json,
      name: newNameSlug,
      guppy: {
        ...(json && json.guppy),
        // Don't override id here as it is a unique id that must not be changed.
        name,
        icon,
      },
    });

    // Update state & close modal
    yield put(saveProjectSettingsFinish(newProject, newPath));
  } catch (err) {
    yield call(handleProjectSaveError, err);
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery(SAVE_PROJECT_SETTINGS_START, handleSaveSettings);
}
