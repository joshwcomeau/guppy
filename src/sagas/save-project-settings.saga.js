// @flow
import { call, put, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import slug from 'slug';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { defaultParentPath } from '../reducers/paths.reducer';

import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';

import {
  // saveProjectSettingsStart,
  saveProjectSettingsFinish,
  hideModal,
  SAVE_PROJECT_SETTINGS_START,
  SAVE_PROJECT_SETTINGS_FINISH,
} from '../actions';

const { dialog } = remote;

function* renameFolder(projectPath, newPath): Saga<void> {
  // console.log('rename', projectPath, newPath);
  yield call([fs, fs.renameSync], projectPath, newPath);
}

export function* finishSettings(): Saga<void> {
  // State updated in projects reducer - we just have to hide the modal here
  yield put(hideModal());
}

export function* saveSettings(action: any): Saga<void> {
  const { project, name, icon } = action;
  const { path: projectPath } = project;
  const id = slug(name).toLowerCase();
  const workspace = path.resolve(projectPath, '../'); // we could use getDefaultParentPath from path.reducers as well - what's better?
  let newPath = projectPath;
  console.log('save settings', id, workspace, newPath, icon, project);
  try {
    // Let's load the basic project info for the path specified, if possible.
    const json = yield call(loadPackageJson, projectPath);
    console.log('json', json); //, json.guppy.isImported, json.guppy);
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
    // TODO: check if imported
    // TODO: show prompt if imported project name change - also change folder ?
    console.log('confirmed', confirmed);
    if (confirmed && nameChanged) {
      newPath = path.join(workspace, id);
      console.log('renaming', renameFolder, projectPath, newPath);
      yield call(renameFolder, projectPath, newPath);
    }

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

    // apply changes to packageJSON
    yield put(saveProjectSettingsFinish(newProject, project.id, newPath));
  } catch (err) {
    console.log(err); // TODO add handling
    // yield call(handleSaveError, err);
    // yield put(saveProjectSaveError());
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery(SAVE_PROJECT_SETTINGS_START, saveSettings);
  yield takeEvery(SAVE_PROJECT_SETTINGS_FINISH, finishSettings);
}
