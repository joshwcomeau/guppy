import mixpanel from 'mixpanel-browser'; // Mocked
import { call, takeEvery } from 'redux-saga/effects';

import {
  ADD_PROJECT,
  IMPORT_EXISTING_PROJECT_FINISH,
  SELECT_PROJECT,
  LAUNCH_DEV_SERVER,
  RUN_TASK,
  CLEAR_CONSOLE,
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  FINISH_DELETING_PROJECT,
} from '../actions';
import logger from '../services/analytics.service';
import {
  createTask,
  createProject,
  createProjectInternal,
} from '../test-helpers/factories.js';
import rootSaga, { handleAction } from './analytics.saga';

describe('analytics saga', () => {
  beforeEach(() => {
    mixpanel.init.mockClear();
    mixpanel.identify.mockClear();
    mixpanel.track.mockClear();
  });

  describe('root analytics saga', () => {
    it('takes all actions', () => {
      const saga = rootSaga();
      expect(saga.next().value).toEqual(takeEvery('*', handleAction));
    });
  });

  describe('handleAction', () => {
    it('ignores untracked actions', () => {
      const project = createProject();

      const action = {
        type: 'A MADEUP ACTION-TYPE',
        project,
      };

      const saga = handleAction(action);

      expect(saga.next().done).toBe(true);
      expect(mixpanel.track.mock.calls).toEqual([]);
    });

    it('tracks ADD_PROJECT', () => {
      const projectInternal = createProjectInternal();

      const action = {
        type: ADD_PROJECT,
        project: projectInternal,
        projectType: 'create-react-app',
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'create-project', { type: 'create-react-app' })
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks IMPORT_EXISTING_PROJECT_FINISH', () => {
      const projectInternal = createProjectInternal();

      const action = {
        type: IMPORT_EXISTING_PROJECT_FINISH,
        project: projectInternal,
        projectType: 'gatsby',
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'import-project', { type: 'gatsby' })
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks SELECT_PROJECT', () => {
      const action = {
        type: SELECT_PROJECT,
        projectId: 'abc',
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'select-project', {})
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks LAUNCH_DEV_SERVER', () => {
      const action = {
        type: LAUNCH_DEV_SERVER,
        task: createTask(),
        timestamp: new Date(),
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'launch-dev-server', {})
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks RUN_TASK', () => {
      const action = {
        type: RUN_TASK,
        task: createTask({ name: 'build' }),
        timestamp: new Date(),
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'run-task', { name: 'build' })
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks CLEAR_CONSOLE', () => {
      const action = {
        type: CLEAR_CONSOLE,
        task: createTask({ name: 'start' }),
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'clear-console', {})
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks ADD_DEPENDENCY', () => {
      const action = {
        type: ADD_DEPENDENCY,
        projectId: 'foo',
        dependencyName: 'redux',
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'add-dependency', { dependencyName: 'redux' })
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks UPDATE_DEPENDENCY', () => {
      const action = {
        type: UPDATE_DEPENDENCY,
        projectId: 'foo',
        dependencyName: 'redux',
        latestVersion: '3.2.2',
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'update-dependency', { dependencyName: 'redux' })
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks DELETE_DEPENDENCY', () => {
      const action = {
        type: DELETE_DEPENDENCY,
        projectId: 'foo',
        dependencyName: 'redux',
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'delete-dependency', { dependencyName: 'redux' })
      );

      expect(saga.next().done).toBe(true);
    });

    it('tracks FINISH_DELETING_PROJECT', () => {
      const action = {
        type: FINISH_DELETING_PROJECT,
        projectId: 'bar',
      };

      const saga = handleAction(action);

      expect(saga.next().value).toEqual(
        call(logger.logEvent, 'delete-project', {})
      );

      expect(saga.next().done).toBe(true);
    });
  });
});
