// @flow
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { getNextActionForProjectId } from '../reducers/queue.reducer';
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

export function* handleAddDependency({
  projectId,
  dependencyName,
  version,
}: Action): Saga<void> {
  const queuedAction = yield select(getNextActionForProjectId, projectId);

  yield put(queueDependencyInstall(projectId, dependencyName, version));

  // if there are no other ongoing operations, begin install
  if (!queuedAction) {
    yield put(installDependencyStart(projectId, dependencyName, version));
  }
}

export function* handleUpdateDependency({
  projectId,
  dependencyName,
  latestVersion,
}: Action): Saga<void> {
  const queuedAction = yield select(getNextActionForProjectId, projectId);

  yield put(
    queueDependencyInstall(projectId, dependencyName, latestVersion, true)
  );

  if (!queuedAction) {
    yield put(
      installDependencyStart(projectId, dependencyName, latestVersion, true)
    );
  }
}

export function* handleDeleteDependency({
  projectId,
  dependencyName,
}: Action): Saga<void> {
  const queuedAction = yield select(getNextActionForProjectId, projectId);

  yield put(queueDependencyUninstall(projectId, dependencyName));

  if (!queuedAction) {
    yield put(uninstallDependencyStart(projectId, dependencyName));
  }
}

export function* handleInstallDependenciesStart({
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

export function* handleUninstallDependenciesStart({
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
  const nextAction = yield select(getNextActionForProjectId, projectId);

  // if there is another item in the queue, start it
  if (nextAction) {
    yield put(startNextActionInQueue(projectId));
  }
}

export function* handleStartNextActionInQueue({
  projectId,
}: Action): Saga<void> {
  const nextAction = yield select(getNextActionForProjectId, projectId);

  // if the queue is empty, log an error
  if (!nextAction) {
    return console.error(
      `attempted to start next action in empty queue for project ${projectId}`
    );
  }

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
  yield takeEvery(ADD_DEPENDENCY, handleAddDependency);
  yield takeEvery(UPDATE_DEPENDENCY, handleUpdateDependency);
  yield takeEvery(DELETE_DEPENDENCY, handleDeleteDependency);
  yield takeEvery(INSTALL_DEPENDENCIES_START, handleInstallDependenciesStart);
  yield takeEvery(
    UNINSTALL_DEPENDENCIES_START,
    handleUninstallDependenciesStart
  );
  yield takeEvery(
    [
      INSTALL_DEPENDENCIES_ERROR,
      INSTALL_DEPENDENCIES_FINISH,
      UNINSTALL_DEPENDENCIES_ERROR,
      UNINSTALL_DEPENDENCIES_FINISH,
    ],
    handleQueueActionCompleted
  );
  yield takeEvery(START_NEXT_ACTION_IN_QUEUE, handleStartNextActionInQueue);
}
