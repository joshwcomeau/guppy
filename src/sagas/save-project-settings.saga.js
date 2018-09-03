// @flow
import { call, put, select, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import slug from 'slug';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { defaultParentPath } from '../reducers/paths.reducer';
import { getNextActionForProjectId } from '../reducers/queue.reducer';

import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';

import {
  saveProjectSettingsStart,
  saveProjectSettingsFinish,
  hideModal,
  queueSaveProjectSettings,
  SAVE_PROJECT_SETTINGS,
  SAVE_PROJECT_SETTINGS_START,
  SAVE_PROJECT_SETTINGS_FINISH,
} from '../actions';

const { dialog } = remote;
const { showErrorBox } = dialog;

function* renameFolder(projectPath, newPath): Saga<void> {
  // console.log('rename', projectPath, newPath);
  yield call([fs, fs.renameSync], projectPath, newPath);
}

export function* handleFinishSettings(): Saga<void> {
  // State updated in projects reducer - we just have to hide the modal here
  yield put(hideModal());
}

export function* handleProjectSaveError(err: Error): Saga<void> {
  // console.log(err.message);
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

// action triggered if queue is empty
export function* handleStartSaveSettings(action: any): Saga<void> {
  const { project, name, icon } = action;
  const { path: projectPath } = project;
  const id = slug(name).toLowerCase();
  const workspace = path.resolve(projectPath, '../'); // we could use getDefaultParentPath from path.reducers as well - what's better?
  let newPath = projectPath;

  try {
    let json;
    try {
      // Let's load the basic project info for the path specified, if possible.
      json = yield call(loadPackageJson, projectPath);
    } catch (err) {
      throw new Error('loading-packageJson-failed');
    }

    // check if imported project & name changed
    const nameChanged = id !== project.id;
    const confirmRequired = workspace !== defaultParentPath && nameChanged;

    // rename confirmed by default
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
      newPath = path.join(workspace, id);
      try {
        yield call(renameFolder, projectPath, newPath);
      } catch (err) {
        throw new Error('renaming-failed');
      }
    }

    // Apply changes to packageJSON
    const newProject = yield call(writePackageJson, newPath, {
      ...json,
      name: id,
      guppy: {
        ...json.guppy,
        name,
        id,
        icon,
      },
    });

    // Update state & close modal
    yield put(saveProjectSettingsFinish(newProject, project.id, newPath));
  } catch (err) {
    yield call(handleProjectSaveError, err);
    // yield put(saveProjectError());
  }
}

// action trigger by button
export function* handleSaveSettings({
  project,
  name,
  icon,
}: Action): Saga<void> {
  const queuedAction = yield select(getNextActionForProjectId, project.id);

  yield put(queueSaveProjectSettings(project.id, { name, icon }));

  // if there are no other ongoing operations, begin install
  if (!queuedAction) {
    yield put(saveProjectSettingsStart(project.id, { name, icon }));
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery(SAVE_PROJECT_SETTINGS, handleSaveSettings);
  yield takeEvery(SAVE_PROJECT_SETTINGS_START, handleStartSaveSettings);
  yield takeEvery(SAVE_PROJECT_SETTINGS_FINISH, handleFinishSettings);
}
