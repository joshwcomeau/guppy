// @flow

import { select, call, put, cancel, takeEvery } from 'redux-saga/effects';
import { getPathForProjectId } from '../reducers/paths.reducer';
import {
  loadProjectDependency,
  loadProjectDependencies,
} from '../services/read-from-disk.service';
import {
  installDependency,
  uninstallDependency,
  installDependencies,
  uninstallDependencies,
} from '../services/dependencies.service';
import {
  ADD_DEPENDENCY_START,
  ADD_DEPENDENCY_ERROR,
  ADD_DEPENDENCY_FINISH,
  UPDATE_DEPENDENCY_START,
  UPDATE_DEPENDENCY_ERROR,
  UPDATE_DEPENDENCY_FINISH,
  DELETE_DEPENDENCY_START,
  DELETE_DEPENDENCY_ERROR,
  DELETE_DEPENDENCY_FINISH,
  ADD_DEPENDENCIES_START,
  ADD_DEPENDENCIES_ERROR,
  ADD_DEPENDENCIES_FINISH,
  DELETE_DEPENDENCIES_START,
  DELETE_DEPENDENCIES_ERROR,
  DELETE_DEPENDENCIES_FINISH,
  addDependencyFinish,
  addDependencyError,
  updateDependencyFinish,
  updateDependencyError,
  deleteDependencyFinish,
  deleteDependencyError,
  addDependenciesStart,
  addDependenciesError,
  addDependenciesFinish,
  deleteDependenciesStart,
  deleteDependenciesError,
  deleteDependenciesFinish,
  showNotification,
  updateNotification,
  completeNotification,
  failNotification,
} from '../actions';

// Since redux-saga is intended to handle side-effects of actions,
// all sagas are run *after* all reducers, even though they are
// incorporated into redux as a middleware. As such, we cannot rely
// on a store-based check for whether or not a package.json is locked,
// as any locking actions will lock it in the store before our saga
// has a chance to check if it is locked or not. As such, we must handle
// monitoring the lock status within the saga, so we can control the
// order of checking.
//
// NOTE: the previous reducer added false entries for new projects on
// addition and for all projects after a refresh, but undefined is
// falsey and has the same effect so I elected not to add an extra
// saga for these actions.
const lock: {
  [projectId: string]: boolean,
} = {};

// The queue is split out into subqueues per project. Each subqueue item
// denotes its action (add/delete), the persistent notification's ID
// for updating its progress in the UI, and a list of dependencies to
// be installed/removed by that action.
const queue: {
  [projectId: string]: Array<{
    action: string,
    notificationId: string,
    dependencies: Array<{
      dependencyName: string,
      version?: string,
      updating?: boolean,
    }>,
  }>,
} = {};

function* addDependency({ projectId, dependencyName, version }) {
  console.log('lock:', lock);
  console.log('queue:', queue);
  if (!(yield call(requestPackageJsonLockForProjectId, projectId))) {
    yield call(enqueue, {
      action: 'install',
      projectId,
      dependencyName,
      version,
    });
    yield cancel();
  } else {
    const notificationId = `${projectId}-install-${dependencyName}`;
    yield put(
      showNotification(notificationId, {
        title: 'Installing dependency...',
        message: `${dependencyName}@${version}`,
      })
    );

    const projectPath = yield select(getPathForProjectId, projectId);
    try {
      yield call(installDependency, projectPath, dependencyName, version);
      const dependency = yield call(
        loadProjectDependency,
        projectPath,
        dependencyName
      );
      yield put(completeNotification(notificationId));
      yield put(addDependencyFinish(projectId, dependency));
    } catch (err) {
      yield call([console, 'error'], 'Failed to install dependency', err);
      yield put(failNotification(notificationId, err));
      yield put(addDependencyError(projectId, dependencyName));
    }
  }
}

function* updateDependency({ projectId, dependencyName, latestVersion }) {
  console.log('lock:', lock);
  console.log('queue:', queue);
  if (!(yield call(requestPackageJsonLockForProjectId, projectId))) {
    yield call(enqueue, {
      action: 'install',
      projectId,
      dependencyName,
      version: latestVersion,
      updating: true,
    });
    yield cancel();
  } else {
    const notificationId = `${projectId}-update-${dependencyName}`;
    yield put(
      showNotification(notificationId, {
        title: 'Updating dependency...',
        message: `${dependencyName}@${latestVersion}`,
      })
    );

    const projectPath = yield select(getPathForProjectId, projectId);
    try {
      yield call(installDependency, projectPath, dependencyName, latestVersion);
      yield put(completeNotification(notificationId));
      yield put(
        updateDependencyFinish(projectId, dependencyName, latestVersion)
      );
    } catch (err) {
      yield call([console, 'error'], 'Failed to update dependency', err);
      yield put(failNotification(notificationId, err));
      yield put(updateDependencyError(projectId, dependencyName));
    }
  }
}

function* deleteDependency({ projectId, dependencyName }) {
  console.log('lock:', lock);
  console.log('queue:', queue);
  if (!(yield call(requestPackageJsonLockForProjectId, projectId))) {
    yield call(enqueue, { action: 'uninstall', projectId, dependencyName });
    yield cancel();
  } else {
    const notificationId = `${projectId}-delete-${dependencyName}`;
    yield put(
      showNotification(notificationId, {
        title: 'Deleting dependency...',
        message: dependencyName,
      })
    );

    const projectPath = yield select(getPathForProjectId, projectId);
    try {
      yield call(uninstallDependency, projectPath, dependencyName);
      yield put(completeNotification(notificationId));
      yield put(deleteDependencyFinish(projectId, dependencyName));
    } catch (err) {
      yield call([console, 'error'], 'Failed to delete dependency', err);
      yield put(failNotification(notificationId, err));
      yield put(deleteDependencyError(projectId, dependencyName));
    }
  }
}

function* addDependencies({ projectId, notificationId, dependencies }) {
  yield put(
    updateNotification(notificationId, { title: 'Installing dependencies...' })
  );

  const projectPath = yield select(getPathForProjectId, projectId);
  try {
    yield call(installDependencies, projectPath, dependencies);
    const installedDependencies = yield call(
      loadProjectDependencies,
      projectPath,
      dependencies
    );
    yield put(completeNotification(notificationId));
    yield put(addDependenciesFinish(projectId, installedDependencies));
  } catch (err) {
    yield put(failNotification(notificationId, err));
    yield put(addDependenciesError(projectId, dependencies));
  }
}

function* deleteDependencies({ projectId, notificationId, dependencies }) {
  yield put(
    updateNotification(notificationId, { title: 'Deleting dependencies...' })
  );

  const projectPath = yield select(getPathForProjectId, projectId);
  try {
    yield call(uninstallDependencies, projectPath, dependencies);
    yield put(completeNotification(notificationId));
    yield put(deleteDependenciesFinish(projectId, dependencies));
  } catch (err) {
    yield put(failNotification(notificationId, err));
    yield put(deleteDependenciesError(projectId, dependencies));
  }
}

function requestPackageJsonLockForProjectId(projectId) {
  if (lock[projectId]) return false;

  lock[projectId] = true;
  return true;
}

function* enqueue({ action, projectId, dependencyName, version }) {
  // If a package.json-locking function is already underway, queue
  // this action up to be fired next in series. If there are already
  // queued actions of the same type, append this action's information
  // to that action so they can all be processed as a single command.
  const projectQueue = queue[projectId] || [];

  let queueIndex = projectQueue.findIndex(q => q.action === action);
  const canCompound = queueIndex !== -1;

  if (!canCompound) {
    const notificationId = `${projectId}-queue-${Date.now()}`;
    projectQueue.push({
      action: action,
      notificationId,
      dependencies: [],
    });
    queueIndex = projectQueue.length - 1;
    yield put(
      showNotification(notificationId, {
        title: `Dependencies queued for ${action}...`,
        message: `${dependencyName}${version ? '@' + version : ''}`,
      })
    );
  }

  projectQueue[queueIndex].dependencies.push({
    dependencyName,
    version,
  });
  queue[projectId] = projectQueue;

  if (canCompound) {
    const queueAction = projectQueue[queueIndex];
    yield put(
      updateNotification(queueAction.notificationId, {
        message: queueAction.dependencies
          .map(
            dependency =>
              `${dependency.dependencyName}${
                dependency.version ? '@' + dependency.version : ''
              }`
          )
          .join(', '),
      })
    );
  }
}

function* dequeue({ projectId }) {
  console.log('lock:', lock);
  console.log('queue:', queue);

  // As soon a package.json-locking function completes, unlock the
  // corresponding package.json.
  lock[projectId] = false;

  // Attempt to remove the next set of pending dependencies for that
  // project from the queue and dispatch an action to run them.
  if (queue[projectId] && queue[projectId].length > 0) {
    const nextAction = queue[projectId].shift();
    const actionCreator =
      nextAction.action === 'install'
        ? addDependenciesStart
        : deleteDependenciesStart;
    yield put(
      actionCreator(
        projectId,
        nextAction.notificationId,
        nextAction.dependencies
      )
    );
  }
}

// $FlowFixMe
export default function* rootSaga() {
  yield takeEvery(ADD_DEPENDENCY_START, addDependency);
  yield takeEvery(UPDATE_DEPENDENCY_START, updateDependency);
  yield takeEvery(DELETE_DEPENDENCY_START, deleteDependency);
  yield takeEvery(ADD_DEPENDENCIES_START, addDependencies);
  yield takeEvery(DELETE_DEPENDENCIES_START, deleteDependencies);
  yield takeEvery(
    [
      ADD_DEPENDENCY_ERROR,
      ADD_DEPENDENCY_FINISH,
      UPDATE_DEPENDENCY_ERROR,
      UPDATE_DEPENDENCY_FINISH,
      DELETE_DEPENDENCY_ERROR,
      DELETE_DEPENDENCY_FINISH,
      ADD_DEPENDENCIES_ERROR,
      ADD_DEPENDENCIES_FINISH,
      DELETE_DEPENDENCIES_ERROR,
      DELETE_DEPENDENCIES_FINISH,
    ],
    dequeue
  );
}
