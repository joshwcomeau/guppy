// @flow
import { call, put, select, takeEvery } from 'redux-saga/effects';

import {
  refreshProjectsFinish,
  refreshProjectsError,
  REFRESH_PROJECTS_START,
} from '../actions';
import { loadGuppyProjects } from '../services/read-from-disk.service';
import { getPathsArray } from '../reducers/paths.reducer';
import { checkIfNodeIsAvailable } from '../services/shell.service';
import { showCustomError } from '../services/custom-dialog.service';
import type { Saga } from 'redux-saga';

export function* refreshProjects(): Saga<void> {
  const pathsArray = yield select(getPathsArray);

  try {
    yield call(checkIfNodeIsAvailable); // returns node version string
  } catch (err) {
    // Node not available bail early
    // yield call(
    //   showErrorBox,
    //   'Node missing',
    //   "Egad! Seems like Node is not installed. Please install Node.js and that it is available on your system path. Please have a look at our installation guide: https://github.com/joshwcomeau/guppy/blob/master/README.md#installation"
    // );
    yield call(
      showCustomError,
      'Node missing',
      'Egad! Seems like Node is not installed. Please install Node.js and check that it is available on your system path. Please have a look at our installation guide:',
      {
        href:
          'https://github.com/joshwcomeau/guppy/blob/master/README.md#installation',
        text:
          ' https://github.com/joshwcomeau/guppy/blob/master/README.md#installation',
      }
    );
    return;
  }

  try {
    const projectsFromDisk = yield call(loadGuppyProjects, pathsArray);

    yield put(refreshProjectsFinish(projectsFromDisk));
  } catch (err) {
    yield put(refreshProjectsError(err));
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery(REFRESH_PROJECTS_START, refreshProjects);
}
