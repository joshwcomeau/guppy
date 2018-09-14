// @flow
/**
 * This saga is responsible for the bulk of our tracking, by listening for
 * dispatched actions and firing off log events to our analytics provider.
 *
 * It is not the exclusive source of track events; React components can fire
 * them as well. For example, `App.js` fires a `load-application` event on
 * mount.
 *
 * The goal of our analytics is to help us understand how people are using
 * Guppy so that we can make it better for them. Guppy is not a money-making
 * operation, so we aren't interested in data-mining or collecting any
 * personally-identifiable information. We don't collect information about,
 * for example, what people name their projects, because that doesn't teach
 * us anything about how we can make Guppy better.
 */
import { call, takeEvery } from 'redux-saga/effects';

import logger from '../services/analytics.service';
import {
  ADD_PROJECT,
  IMPORT_EXISTING_PROJECT_FINISH,
  SELECT_PROJECT,
  CLEAR_CONSOLE,
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  RUN_TASK,
  FINISH_DELETING_PROJECT,
} from '../actions';

import type { Action } from 'redux';
import type { Saga } from 'redux-saga';
import type { EventType } from '../services/analytics.service';

type LoggableAction = {
  name: EventType,
  getMetadata: (payload: Object) => Object,
};

type LoggableActionsMap = {
  [actionType: string]: LoggableAction,
};

const loggableActions: LoggableActionsMap = {
  [ADD_PROJECT]: {
    name: 'create-project',
    getMetadata: payload => ({ type: payload.project.type }),
  },
  [IMPORT_EXISTING_PROJECT_FINISH]: {
    name: 'import-project',
    getMetadata: payload => ({ type: payload.project.type }),
  },
  [SELECT_PROJECT]: {
    name: 'select-project',
    getMetadata: payload => ({}),
  },
  [RUN_TASK]: {
    name: 'run-task',
    getMetadata: payload => ({ name: payload.task.name }),
  },
  [CLEAR_CONSOLE]: {
    name: 'clear-console',
    getMetadata: payload => ({}),
  },
  [ADD_DEPENDENCY]: {
    name: 'add-dependency',
    getMetadata: payload => ({
      dependencyName: payload.dependencyName,
    }),
  },
  [UPDATE_DEPENDENCY]: {
    name: 'update-dependency',
    getMetadata: payload => ({
      dependencyName: payload.dependencyName,
    }),
  },
  [DELETE_DEPENDENCY]: {
    name: 'delete-dependency',
    getMetadata: payload => ({
      dependencyName: payload.dependencyName,
    }),
  },
  [FINISH_DELETING_PROJECT]: {
    name: 'delete-project',
    getMetadata: payload => ({}),
  },
};

export function* handleAction({ type, ...payload }: Action): Saga<void> {
  if (loggableActions[type]) {
    const { name, getMetadata } = loggableActions[type];
    const metadata = getMetadata(payload);

    yield call(logger.logEvent, name, metadata);
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery('*', handleAction);
}
