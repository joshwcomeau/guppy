// @flow
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { getPathForProjectId } from '../reducers/paths.reducer';
import {
  installDependency,
  uninstallDependency,
} from '../services/dependencies.service';
import { loadProjectDependency } from '../services/read-from-disk.service';
import {
  ADD_DEPENDENCY_START,
  UPDATE_DEPENDENCY_START,
  DELETE_DEPENDENCY_START,
  addDependencyFinish,
  addDependencyError,
  updateDependencyFinish,
  updateDependencyError,
  deleteDependencyFinish,
  deleteDependencyError,
} from '../actions';

import type { Action } from 'redux';
import type { Saga } from 'redux-saga';

/**
 * Trying to install new dependency, if success dispatching "finish" action
 * if not - dispatching "error" ection
 */
export function* addDependency({
  projectId,
  dependencyName,
  version,
}: Action): Saga<void> {
  const projectPath = yield select(getPathForProjectId, projectId);
  try {
    yield call(installDependency, projectPath, dependencyName, version);
    const dependency = yield call(
      loadProjectDependency,
      projectPath,
      dependencyName
    );
    yield put(addDependencyFinish(projectId, dependency));
  } catch (err) {
    yield call([console, 'error'], 'Failed to install dependency', err);
    yield put(addDependencyError(projectId, dependencyName));
  }
}

/**
 * Trying to update existing dependency, if success dispatching "finish" action,
 * if not - dispatching "error" action
 */
export function* updateDependency({
  projectId,
  dependencyName,
  latestVersion,
}: Action): Saga<void> {
  const projectPath = yield select(getPathForProjectId, projectId);
  try {
    yield call(installDependency, projectPath, dependencyName, latestVersion);
    yield put(updateDependencyFinish(projectId, dependencyName, latestVersion));
  } catch (err) {
    yield call([console, 'error'], 'Failed to update dependency', err);
    yield put(updateDependencyError(projectId, dependencyName));
  }
}

/**
 * Trying to delete dependency, if success dispatching "finish" action,
 * if not - dispatching "error" action
 */
export function* deleteDependency({
  projectId,
  dependencyName,
}: Action): Saga<void> {
  const projectPath = yield select(getPathForProjectId, projectId);
  try {
    yield call(uninstallDependency, projectPath, dependencyName);
    yield put(deleteDependencyFinish(projectId, dependencyName));
  } catch (err) {
    yield call([console, 'error'], 'Failed to delete dependency', err);
    yield put(deleteDependencyError(projectId, dependencyName));
  }
}

/**
 * Root dependencies saga, watching for "start" actions
 */
export default function* rootSaga(): Saga<void> {
  yield takeEvery(ADD_DEPENDENCY_START, addDependency);
  yield takeEvery(UPDATE_DEPENDENCY_START, updateDependency);
  yield takeEvery(DELETE_DEPENDENCY_START, deleteDependency);
}
