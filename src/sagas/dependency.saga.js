// @flow
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { getPathForProjectId } from '../reducers/paths.reducer';
import {
  getPackageJsonLockedForProjectId,
  getNextActionForProjectId,
} from '../reducers/queue.reducer';
import {
  installDependencies,
  uninstallDependencies,
} from '../services/dependencies.service';
import { loadProjectDependencies } from '../services/read-from-disk.service';
import {
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  INSTALL_DEPENDENCIES_START,
  INSTALL_DEPENDENCIES_ERROR,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_START,
  UNINSTALL_DEPENDENCIES_ERROR,
  UNINSTALL_DEPENDENCIES_FINISH,
  START_NEXT_ACTION_IN_QUEUE,
  queueDependencyInstall,
  queueDependencyUninstall,
  installDependencyStart,
  installDependenciesStart,
  installDependenciesError,
  installDependenciesFinish,
  uninstallDependencyStart,
  uninstallDependenciesStart,
  uninstallDependenciesError,
  uninstallDependenciesFinish,
  startNextActionInQueue,
} from '../actions';

import type { Action } from 'redux';
import type { Saga } from 'redux-saga';

export function* addDependency({
  projectId,
  dependencyName,
  version,
}: Action): Saga<void> {
  const packageJsonLocked = yield select(
    getPackageJsonLockedForProjectId,
    projectId
  );
  const dependency = { name: dependencyName, version };

  // if there are ongoing actions, queue this dependency
  if (packageJsonLocked) {
    yield put(queueDependencyInstall(projectId, dependency));
  } else {
    // if the queue for this project is empty, go ahead and install
    // the dependency
    yield put(installDependencyStart(projectId, dependency));
  }
}

export function* updateDependency({
  projectId,
  dependencyName,
  latestVersion,
}: Action): Saga<void> {
  const packageJsonLocked = yield select(
    getPackageJsonLockedForProjectId,
    projectId
  );
  const dependency = {
    name: dependencyName,
    version: latestVersion,
    updating: true,
  };

  if (packageJsonLocked) {
    yield put(queueDependencyInstall(projectId, dependency));
  } else {
    yield put(installDependencyStart(projectId, dependency));
  }
}

export function* deleteDependency({
  projectId,
  dependencyName,
}: Action): Saga<void> {
  const packageJsonLocked = yield select(
    getPackageJsonLockedForProjectId,
    projectId
  );
  const dependency = { name: dependencyName };

  if (packageJsonLocked) {
    yield put(queueDependencyUninstall(projectId, dependency));
  } else {
    yield put(uninstallDependencyStart(projectId, dependency));
  }
}

export function* startInstallingDependencies({
  projectId,
  dependencies,
}: Action): Saga<void> {
  const projectPath = yield select(getPathForProjectId, projectId);

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

export function* startUninstallingDependencies({
  projectId,
  dependencies,
}: Action): Saga<void> {
  const projectPath = yield select(getPathForProjectId, projectId);

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

export function* handleQueueActionCompleted({ projectId }: Action): Saga<void> {
  yield put(startNextActionInQueue(projectId));
}

export function* handleNextActionInQueue({ projectId }: Action): Saga<void> {
  const nextAction = yield select(getNextActionForProjectId, projectId);

  // if the queue is empty, take no further action
  if (!nextAction) return;

  const actionCreator =
    nextAction.action === 'install'
      ? installDependenciesStart
      : uninstallDependenciesStart;
  yield put(actionCreator(projectId, nextAction.dependencies));
}

// Installs/uninstalls fail silently - the only notice of a failed action
// visible to the user is either the dependency disappearing entirely or
// having its status set back to `idle`.
// TODO: display an error message outside of the console when a dependency
// action fails
export default function* rootSaga(): Saga<void> {
  yield takeEvery(ADD_DEPENDENCY, addDependency);
  yield takeEvery(UPDATE_DEPENDENCY, updateDependency);
  yield takeEvery(DELETE_DEPENDENCY, deleteDependency);
  yield takeEvery(INSTALL_DEPENDENCIES_START, startInstallingDependencies);
  yield takeEvery(UNINSTALL_DEPENDENCIES_START, startUninstallingDependencies);
  yield takeEvery(
    [
      INSTALL_DEPENDENCIES_ERROR,
      INSTALL_DEPENDENCIES_FINISH,
      UNINSTALL_DEPENDENCIES_ERROR,
      UNINSTALL_DEPENDENCIES_FINISH,
    ],
    handleQueueActionCompleted
  );
  yield takeEvery(START_NEXT_ACTION_IN_QUEUE, handleNextActionInQueue);
}
