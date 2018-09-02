import { select, put } from 'redux-saga/effects';
// import { getPathForProjectId } from '../reducers/paths.reducer';
import { getNextActionForProjectId } from '../reducers/queue.reducer';

import {
  installDependenciesStart,
  uninstallDependenciesStart,
  startNextActionInQueue,
  modifyProjectStart,
} from '../actions';

import type { Action } from 'redux';
import type { Saga } from 'redux-saga';

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
    case 'modify':
      yield put(modifyProjectStart(projectId, nextAction.settings));
      break;
  }
}
