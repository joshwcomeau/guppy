// @flow
import { delay } from 'redux-saga';
import { select, call, put, take, takeEvery } from 'redux-saga/effects';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { getNextActionForProjectId } from '../reducers/queue.reducer';
import {
  installDependencies,
  reinstallDependencies,
  uninstallDependencies,
} from '../services/dependencies.service';
import {
  loadProjectDependencies,
  loadAllProjectDependencies,
} from '../services/read-from-disk.service';
import { waitForAsyncRimraf } from './delete-project.saga';
import {
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  INSTALL_DEPENDENCIES_START,
  REINSTALL_DEPENDENCIES_START,
  UNINSTALL_DEPENDENCIES_START,
  LOAD_DEPENDENCY_INFO_FROM_DISK_START,
  queueDependencyInstall,
  queueDependencyUninstall,
  installDependenciesError,
  installDependenciesFinish,
  reinstallDependenciesFinish,
  reinstallDependenciesError,
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
  loadDependencyInfoFromDiskError,
  refreshProjectsStart,
  reinstallDependenciesStart,
  setStatusText,
  resetStatusText,
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

export function* handleReinstallDependenciesStart({
  projectId,
}: ReturnType<typeof reinstallDependenciesStart>): Saga<void> {
  if (!projectId) {
    // don't trigger a reinstall if we're not having a projectId --> fail silently
    return;
  }
  const projectPath = yield select(getPathForProjectId, {
    projectId,
  });
  try {
    // delete node_modules folder
    yield call(waitForAsyncRimraf, projectPath);

    // reinstall dependencies
    const channel = yield call(reinstallDependencies, projectPath);

    // The channel is used to pass every termianl output to loadingScreen status text
    yield call(watchInstallMessages, channel);

    // load dependencies to refresh state
    yield put(loadDependencyInfoFromDiskStart(projectId, projectPath));

    // refresh projects
    yield put(refreshProjectsStart());

    // reset status text of loading screen
    yield put(resetStatusText());

    // reinstall finished --> hide waiting spinner
    // todo: do we need an error handling here? We could check result.exit === 1 for an error.
    yield put(reinstallDependenciesFinish());
  } catch (err) {
    yield call(
      [console, console.error],
      'Failed to reinstall dependencies',
      err
    );
    yield put(reinstallDependenciesError(projectId));
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
    yield put(loadDependencyInfoFromDiskError(projectId));
  }
}

// helpers
function filterYarnInstallMessages(message: string) {
  // only get [1/4] ... messages and strip warnings (warnings are logged before [1/4])
  // would be nice if we could show the warnings separately later - for now stripping is OK.
  const matches = /\[.*/.exec(message);
  return matches && matches[0];
}

export function* watchInstallMessages(channel: any): any {
  let output;
  try {
    while (true) {
      output = yield take(channel);
      if (!output.hasOwnProperty('exit')) {
        // Not the final message
        const installMsg =
          output.data && filterYarnInstallMessages(output.data);
        yield put(setStatusText(installMsg));
      } else {
        // Yield exit code and complete stdout
        yield output;

        // Delay a bit for the progress bar to finish animation before hiding
        // --> Hacky but is working. With-out the delay the progress bar is hidden before reaching 100%
        yield delay(1500);

        // Close channel manually --> emitter(END) inside spwanProcessChannel would exit too early
        channel.close();
      }
    }
  } finally {
    /* Normal exit of channel. No need to do anything here */
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
    REINSTALL_DEPENDENCIES_START,
    handleReinstallDependenciesStart
  );
  yield takeEvery(
    UNINSTALL_DEPENDENCIES_START,
    handleUninstallDependenciesStart
  );
  yield takeEvery(
    LOAD_DEPENDENCY_INFO_FROM_DISK_START,
    handleLoadDependencyInfoFromDiskStart
  );
}
