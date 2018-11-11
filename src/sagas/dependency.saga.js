// @flow
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { getNextActionForProjectId } from '../reducers/queue.reducer';
import {
  installDependencies,
  uninstallDependencies,
} from '../services/dependencies.service';
import {
  loadProjectDependencies,
  loadAllProjectDependencies,
} from '../services/read-from-disk.service';
import {
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  INSTALL_DEPENDENCIES_START,
  UNINSTALL_DEPENDENCIES_START,
  LOAD_DEPENDENCY_INFO_FROM_DISK_START,
  queueDependencyInstall,
  queueDependencyUninstall,
  installDependenciesError,
  installDependenciesFinish,
  uninstallDependenciesError,
  uninstallDependenciesFinish,
  startNextActionInQueue,
  loadDependencyInfoFromDiskFinish,
  addDependency,
  updateDependency,
  deleteDependency,
  installDependenciesStart,
  uninstallDependenciesStart,
  loadDependencyInfoFromDiskStart,
} from '../actions';

import type { Saga } from 'redux-saga';
import type { ReturnType } from '../actions/types';

export function* handleAddDependency({
  projectId,
  dependencyName,
  version,
}: ReturnType<typeof addDependency>): Saga<void> {
  const queuedAction = yield select(getNextActionForProjectId, { projectId });

  yield put(queueDependencyInstall(projectId, dependencyName, version));

  // if there are no other ongoing operations, begin install
  if (!queuedAction) {
    yield put(startNextActionInQueue(projectId));
  }
}

export function* handleUpdateDependency({
  projectId,
  dependencyName,
  latestVersion,
}: ReturnType<typeof updateDependency>): Saga<void> {
  const queuedAction = yield select(getNextActionForProjectId, { projectId });

  yield put(
    queueDependencyInstall(projectId, dependencyName, latestVersion, true)
  );

  if (!queuedAction) {
    yield put(startNextActionInQueue(projectId));
  }
}

export function* handleDeleteDependency({
  projectId,
  dependencyName,
}: ReturnType<typeof deleteDependency>): Saga<void> {
  const queuedAction = yield select(getNextActionForProjectId, { projectId });

  yield put(queueDependencyUninstall(projectId, dependencyName));

  if (!queuedAction) {
    yield put(startNextActionInQueue(projectId));
  }
}

export function* handleInstallDependenciesStart({
  projectId,
  dependencies,
}: ReturnType<typeof installDependenciesStart>): Saga<void> {
  const projectPath = yield select(getPathForProjectId, { projectId });

  try {
    yield call(installDependencies, projectPath, dependencies);
    const storedDependencies = yield call(
      loadProjectDependencies,
      projectPath,
      dependencies
    );
    yield put(installDependenciesFinish(projectId, storedDependencies));
  } catch (err) {
    yield call([console, console.error], 'Failed to install dependencies', err);
    yield put(installDependenciesError(projectId, dependencies));
  }
}

export function* handleUninstallDependenciesStart({
  projectId,
  dependencies,
}: ReturnType<typeof uninstallDependenciesStart>): Saga<void> {
  const projectPath = yield select(getPathForProjectId, { projectId });

  try {
    yield call(uninstallDependencies, projectPath, dependencies);
    yield put(uninstallDependenciesFinish(projectId, dependencies));
  } catch (err) {
    yield call(
      [console, console.error],
      'Failed to uninstall dependencies',
      err
    );
    yield put(uninstallDependenciesError(projectId, dependencies));
  }
}

export function* handleLoadDependencyInfoFromDiskStart({
  projectId,
  projectPath,
}: ReturnType<typeof loadDependencyInfoFromDiskStart>): Saga<void> {
  try {
    const dependencies = yield call(loadAllProjectDependencies, projectPath);
    yield put(loadDependencyInfoFromDiskFinish(projectId, dependencies));
  } catch (err) {
    yield call(
      [console, console.error],
      'Failed to load dependencies from disk',
      err
    );
  }
}

// Installs/uninstalls fail silently - the only notice of a failed action
// visible to the user is either the dependency disappearing entirely or
// having its status set back to `idle`.
// TODO: display an error message outside of the console when a dependency
// action fails
export default function* rootSaga(): Saga<void> {
  yield takeEvery(ADD_DEPENDENCY, handleAddDependency);
  yield takeEvery(UPDATE_DEPENDENCY, handleUpdateDependency);
  yield takeEvery(DELETE_DEPENDENCY, handleDeleteDependency);
  yield takeEvery(INSTALL_DEPENDENCIES_START, handleInstallDependenciesStart);
  yield takeEvery(
    UNINSTALL_DEPENDENCIES_START,
    handleUninstallDependenciesStart
  );
  yield takeEvery(
    LOAD_DEPENDENCY_INFO_FROM_DISK_START,
    handleLoadDependencyInfoFromDiskStart
  );
}
