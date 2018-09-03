import {
  REFRESH_PROJECTS_FINISH,
  ADD_PROJECT,
  RUN_TASK,
  COMPLETE_TASK,
  RESET_ALL_STATE,
} from '../actions';

import reducer, { getTaskDescription, initialState } from './tasks.reducer';

describe('Tasks reducer', () => {
  describe(REFRESH_PROJECTS_FINISH, () => {
    it('captures task data from new projects', () => {
      const prevState = reducer(undefined, {});

      const action = {
        type: REFRESH_PROJECTS_FINISH,
        projects: {
          foo: {
            name: 'foo',
            guppy: { id: 'foo' },
            scripts: {
              start: 'react-scripts start',
            },
          },
          bar: {
            name: 'bar',
            guppy: { id: 'bar' },
            scripts: {
              start: 'react-scripts start',
            },
          },
          baz: {
            name: 'baz',
            guppy: { id: 'baz' },
            scripts: {
              start: 'react-scripts start',
              build: 'react-scripts build',
            },
          },
        },
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          id: 'foo-start',
          projectId: 'foo',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'sustained',
        },
        'bar-start': {
          id: 'bar-start',
          projectId: 'bar',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'sustained',
        },
        'baz-start': {
          id: 'baz-start',
          projectId: 'baz',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'sustained',
        },
        'baz-build': {
          id: 'baz-build',
          projectId: 'baz',
          name: 'build',
          command: 'react-scripts build',
          description: getTaskDescription('build'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'short-term',
        },
      };

      expect(actualState).toEqual(expectedState);
    });

    it("doesn't overwrite existing task data, other than command", () => {
      const timestamp = new Date();
      const logs = [{ text: 'Thing happened', id: '1' }];

      const prevState = {
        'foo-start': {
          id: 'foo-start',
          projectId: 'foo',
          name: 'start',
          // By default, our initial state has the default command for `start`
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs,
          type: 'sustained',
        },
      };

      const action = {
        type: REFRESH_PROJECTS_FINISH,
        projects: {
          foo: {
            name: 'foo',
            guppy: { id: 'foo' },
            scripts: {
              // The action updates the script to have a flag:
              start: 'react-scripts start --some-flag=true',
            },
          },
          // We're also adding in a new project, just to make sure that
          // additional projects can be added at the same time.
          bar: {
            name: 'bar',
            guppy: { id: 'bar' },
            scripts: {
              start: 'react-scripts start',
            },
          },
        },
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          id: 'foo-start',
          projectId: 'foo',
          name: 'start',
          command: 'react-scripts start --some-flag=true',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs,
          type: 'sustained',
        },
        'bar-start': {
          id: 'bar-start',
          projectId: 'bar',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'sustained',
        },
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe(ADD_PROJECT, () => {
    it('generates initial task data for a new project', () => {
      const timestamp = new Date();

      const prevState = {
        'foo-start': {
          id: 'foo-start',
          projectId: 'foo',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs: [],
          type: 'sustained',
        },
      };

      const action = {
        type: ADD_PROJECT,
        project: {
          name: 'bar',
          guppy: { id: 'bar' },
          scripts: {
            start: 'react-scripts start',
          },
        },
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          id: 'foo-start',
          projectId: 'foo',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs: [],
          type: 'sustained',
        },
        'bar-start': {
          id: 'bar-start',
          projectId: 'bar',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'sustained',
        },
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe(RUN_TASK, () => {
    it('marks a task as running', () => {
      const mainTask = {
        id: 'foo-start',
        projectId: 'foo',
        name: 'start',
        command: 'react-scripts start',
        description: getTaskDescription('start'),
        status: 'idle',
        timeSinceStatusChange: null,
        logs: [],
        type: 'sustained',
      };

      const prevState = {
        'foo-start': mainTask,
        'foo-build': {
          id: 'foo-build',
          projectId: 'foo',
          name: 'build',
          command: 'react-scripts build',
          description: getTaskDescription('build'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'short-term',
        },
      };

      // Running a task means that it updates the `timeSinceStatusChange`.
      // Pass a timestamp along with the action.
      const timestamp = new Date();

      const action = {
        type: RUN_TASK,
        task: mainTask,
        timestamp,
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          id: 'foo-start',
          projectId: 'foo',
          name: 'start',
          command: 'react-scripts start',
          description: getTaskDescription('start'),
          status: 'success',
          timeSinceStatusChange: timestamp,
          logs: [],
          type: 'sustained',
        },
        'foo-build': {
          id: 'foo-build',
          projectId: 'foo',
          name: 'build',
          command: 'react-scripts build',
          description: getTaskDescription('build'),
          status: 'idle',
          timeSinceStatusChange: null,
          logs: [],
          type: 'short-term',
        },
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe(COMPLETE_TASK, () => {
    it('marks a sustained task as idle, when it was successful', () => {
      const mainTask = {
        id: 'foo-start',
        projectId: 'foo',
        name: 'start',
        command: 'react-scripts start',
        description: getTaskDescription('start'),
        status: 'success',
        timeSinceStatusChange: null,
        logs: [],
        type: 'sustained',
      };

      const otherTask = {
        id: 'foo-build',
        projectId: 'foo',
        name: 'build',
        command: 'react-scripts build',
        description: getTaskDescription('build'),
        status: 'pending',
        timeSinceStatusChange: null,
        logs: [],
        type: 'short-term',
      };

      const prevState = {
        'foo-start': mainTask,
        'foo-build': otherTask,
      };

      const timestamp = new Date();

      const action = {
        type: COMPLETE_TASK,
        task: mainTask,
        timestamp,
        wasSuccessful: true,
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          ...mainTask,
          status: 'idle',
          timeSinceStatusChange: timestamp,
        },
        'foo-build': otherTask,
      };

      expect(actualState).toEqual(expectedState);
    });

    it('marks a sustained task as idle, when it fails', () => {
      const mainTask = {
        id: 'foo-start',
        projectId: 'foo',
        name: 'start',
        command: 'react-scripts start',
        description: getTaskDescription('start'),
        status: 'success',
        timeSinceStatusChange: null,
        logs: [],
        type: 'sustained',
      };

      const otherTask = {
        id: 'foo-build',
        projectId: 'foo',
        name: 'build',
        command: 'react-scripts build',
        description: getTaskDescription('build'),
        status: 'pending',
        timeSinceStatusChange: null,
        logs: [],
        type: 'short-term',
      };

      const prevState = {
        'foo-start': mainTask,
        'foo-build': otherTask,
      };

      const timestamp = new Date();

      const action = {
        type: COMPLETE_TASK,
        task: mainTask,
        timestamp,
        wasSuccessful: false,
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          ...mainTask,
          status: 'idle',
          timeSinceStatusChange: timestamp,
        },
        'foo-build': otherTask,
      };

      expect(actualState).toEqual(expectedState);
    });

    it('marks a short-term task as success, when it was successful', () => {
      const mainTask = {
        id: 'foo-start',
        projectId: 'foo',
        name: 'start',
        command: 'react-scripts start',
        description: getTaskDescription('start'),
        status: 'success',
        timeSinceStatusChange: null,
        logs: [],
        type: 'short-term',
      };

      const otherTask = {
        id: 'foo-build',
        projectId: 'foo',
        name: 'build',
        command: 'react-scripts build',
        description: getTaskDescription('build'),
        status: 'pending',
        timeSinceStatusChange: null,
        logs: [],
        type: 'short-term',
      };

      const prevState = {
        'foo-start': mainTask,
        'foo-build': otherTask,
      };

      const timestamp = new Date();

      const action = {
        type: COMPLETE_TASK,
        task: mainTask,
        timestamp,
        wasSuccessful: true,
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          ...mainTask,
          status: 'success',
          timeSinceStatusChange: timestamp,
        },
        'foo-build': otherTask,
      };

      expect(actualState).toEqual(expectedState);
    });

    it('marks a short-term task as failed, when it fails', () => {
      const mainTask = {
        id: 'foo-start',
        projectId: 'foo',
        name: 'start',
        command: 'react-scripts start',
        description: getTaskDescription('start'),
        status: 'success',
        timeSinceStatusChange: null,
        logs: [],
        type: 'short-term',
      };

      const otherTask = {
        id: 'foo-build',
        projectId: 'foo',
        name: 'build',
        command: 'react-scripts build',
        description: getTaskDescription('build'),
        status: 'pending',
        timeSinceStatusChange: null,
        logs: [],
        type: 'short-term',
      };

      const prevState = {
        'foo-start': mainTask,
        'foo-build': otherTask,
      };

      const timestamp = new Date();

      const action = {
        type: COMPLETE_TASK,
        task: mainTask,
        timestamp,
        wasSuccessful: false,
      };

      const actualState = reducer(prevState, action);
      const expectedState = {
        'foo-start': {
          ...mainTask,
          status: 'failed',
          timeSinceStatusChange: timestamp,
        },
        'foo-build': otherTask,
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe(RESET_ALL_STATE, () => {
    it('resets to initialState', () => {
      const prevState = {
        'foo-start': {},
      };
      const action = {
        type: RESET_ALL_STATE,
      };
      const actualState = reducer(prevState, action);

      expect(actualState).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    describe('getTaskDescription', () => {
      it('start', () => {
        expect(getTaskDescription('start')).toBe(
          'Run a local development server'
        );
      });

      it('build', () => {
        expect(getTaskDescription('build')).toBe(
          'Bundle your project for production'
        );
      });

      it('test', () => {
        expect(getTaskDescription('test')).toBe('Run the automated tests');
      });

      it('eject', () => {
        expect(getTaskDescription('eject')).toBe(
          'Permanently reveal the create-react-app configuration files'
        );
      });

      it('format', () => {
        expect(getTaskDescription('format')).toBe(
          'Runs a formatter that tweaks your code to align with industry best-practices'
        );
      });

      it('unrecognized', () => {
        expect(getTaskDescription('gfsagsdgsdfgsd')).toBe('');
      });
    });
  });
});
