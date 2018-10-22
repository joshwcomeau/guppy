// @flow
import { select, put, takeEvery } from 'redux-saga/effects';
import { getNextActionForProjectId } from '../reducers/queue.reducer';

import {
  installDependenciesStart,
  uninstallDependenciesStart,
  startNextActionInQueue,
  INSTALL_DEPENDENCIES_ERROR,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_ERROR,
  UNINSTALL_DEPENDENCIES_FINISH,
  START_NEXT_ACTION_IN_QUEUE,
  installDependenciesError,
  installDependenciesFinish,
  uninstallDependenciesError,
  uninstallDependenciesFinish,
} from '../actions';

import type { Saga } from 'redux-saga';
import type { ReturnType } from '../actions/types';

export function* handleQueueActionCompleted({
  projectId,
}:
  | ReturnType<typeof installDependenciesError>
  | ReturnType<typeof installDependenciesFinish>
  | ReturnType<typeof uninstallDependenciesError>
  | ReturnType<typeof uninstallDependenciesFinish>): Saga<void> {
  const nextAction = yield select(getNextActionForProjectId, { projectId });

  // if there is another item in the queue, start it
  if (nextAction) {
    yield put(startNextActionInQueue(projectId));
  }
}

export function* handleStartNextActionInQueue({
  projectId,
}: ReturnType<typeof startNextActionInQueue>): Saga<void> {
  const nextAction = yield select(getNextActionForProjectId, { projectId });

  // if the queue is empty, take no further action
  if (!nextAction) return;

  // eslint-disable-next-line default-case
  switch (nextAction.action) {
    case 'install':
      yield put(installDependenciesStart(projectId, nextAction.dependencies));
      break;
    case 'uninstall':
      yield put(uninstallDependenciesStart(projectId, nextAction.dependencies));
      break;
  }
}

export default function* rootSaga(): Saga<void> {
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
