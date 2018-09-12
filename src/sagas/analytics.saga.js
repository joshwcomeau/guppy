// @flow
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

export function* handleAction({ type, ...data }: Action): Saga<void> {
  switch (type) {
    case ADD_PROJECT: {
      yield call(logger.logEvent, 'create-project', {
        type: data.project.type,
      });
      break;
    }

    case IMPORT_EXISTING_PROJECT_FINISH: {
      yield call(logger.logEvent, 'import-project', {
        type: data.project.type,
      });
      break;
    }

    case SELECT_PROJECT: {
      yield call(logger.logEvent, 'select-project');
      break;
    }

    case RUN_TASK: {
      yield call(logger.logEvent, 'run-task', { name: data.task.name });
      break;
    }

    case CLEAR_CONSOLE: {
      yield call(logger.logEvent, 'clear-console');
      break;
    }

    case ADD_DEPENDENCY: {
      yield call(logger.logEvent, 'add-dependency', {
        dependencyName: data.dependencyName,
      });
      break;
    }

    case UPDATE_DEPENDENCY: {
      yield call(logger.logEvent, 'update-dependency', {
        dependencyName: data.dependencyName,
      });
      break;
    }

    case DELETE_DEPENDENCY: {
      yield call(logger.logEvent, 'delete-dependency', {
        dependencyName: data.dependencyName,
      });
      break;
    }

    case FINISH_DELETING_PROJECT: {
      yield call(logger.logEvent, 'delete-project');
      break;
    }

    default:
      break;
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery('*', handleAction);
}
