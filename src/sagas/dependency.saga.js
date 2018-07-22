// @flow

import { select, call, put, cancel, takeEvery } from 'redux-saga/effects';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { getPackageJsonLockedForProjectId } from '../reducers/package-json-locked.reducer';
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

const queue: {
  [projectId: string]: Array<{
    action: string,
    notificationId: string,
    dependencies: Array<{ dependencyName: string, version?: string }>,
  }>,
} = {};

function* addDependency({ projectId, dependencyName, version }) {
  if (getPackageJsonLockedForProjectId(projectId)) {
    yield call(enqueue, { projectId, dependencyName, version });
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
  if (getPackageJsonLockedForProjectId(projectId)) {
    yield call(enqueue, { projectId, dependencyName, version: latestVersion });
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
  if (getPackageJsonLockedForProjectId(projectId)) {
    yield call(enqueue, { projectId, dependencyName });
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
  // update notification
  // get projectPath
  // call installDependencies
  // handle success notification
  // handle success finish
  // handle failure notification
  // handle failure error
}

function* deleteDependencies({ projectId, notificationId, dependencies }) {
  // update notification
  // get projectPath
  // call uninstallDependencies
  // handle success notification
  // handle success finish
  // handle failure notification
  // handle failure error
}

function* enqueue({ type: actionType, projectId, dependencyName, version }) {
  // If a package.json-locking function is already underway, queue
  // this action up to be fired next in series. If there are already
  // queued actions of the same type, append this action's information
  // to that action so they can all be processed as a single command.
  const pendingAction =
    actionType === DELETE_DEPENDENCY_START ? 'remove' : 'install';
  const projectQueue = queue[projectId] || [];

  let queueIndex = projectQueue.findIndex(q => q.action === pendingAction);
  if (queueIndex === -1) {
    const notificationId = `${projectId}-queue-${Date.now()}`;
    projectQueue.push({
      action: pendingAction,
      notificationId,
      dependencies: [],
    });
    queueIndex = projectQueue.length - 1;
    yield put(
      showNotification(notificationId, {
        title: `Dependencies queued for ${pendingAction}...`,
        message: `${dependencyName}@${version}`,
      })
    );
  } else {
    const queueAction = projectQueue[queueIndex];
    yield put(
      updateNotification(queueAction.notificationId, {
        message: queueAction.dependencies
          .map(
            dependency =>
              `${dependencyName}${
                dependency.version ? '@' + dependency.version : ''
              }`
          )
          .join(', '),
      })
    );
  }

  projectQueue[queueIndex].dependencies.push({
    dependencyName,
    version,
  });
  queue[projectId] = projectQueue;
}

function* dequeue(projectId) {
  // As soon a package.json-locking function completes, remove the next
  // set of pending dependencies for that project off the queue and dispatch
  // an action to run them.
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
