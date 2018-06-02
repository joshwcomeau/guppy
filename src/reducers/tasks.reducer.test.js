import {
  REFRESH_PROJECTS,
  ADD_PROJECT,
  START_TASK,
  ABORT_TASK,
  COMPLETE_TASK,
} from '../actions';

import reducer from './tasks.reducer';

describe('Tasks reducer', () => {
  describe(REFRESH_PROJECTS, () => {
    test('captures task data from new projects', () => {
      const action = {
        type: REFRESH_PROJECTS,
        projects: [
          {
            name: 'foo',
            guppy: { id: 'foo' },
            scripts: {
              start: 'react-scripts start',
            },
          },
          {
            name: 'bar',
            guppy: { id: 'bar' },
            scripts: {
              start: 'react-scripts start',
            },
          },
          {
            name: 'baz',
            guppy: { id: 'baz' },
            scripts: {
              start: 'react-scripts start',
              build: 'react-scripts build',
            },
          },
        ],
      };

      // Get the initial state (should just be a {})
      const initialState = reducer(undefined, {});

      const actualState = reducer(initialState, action);
      const expectedState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
        'bar-start': {
          projectId: 'bar',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
        'baz-start': {
          projectId: 'baz',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
        'baz-build': {
          projectId: 'baz',
          taskName: 'build',
          taskCommand: 'react-scripts build',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
      };

      expect(actualState).toEqual(expectedState);
    });

    test("doesn't overwrite existing task data, other than command", () => {
      const action = {
        type: REFRESH_PROJECTS,
        projects: [
          {
            name: 'foo',
            guppy: { id: 'foo' },
            scripts: {
              start: 'react-scripts start --some-flag=true',
            },
          },
          {
            name: 'bar',
            guppy: { id: 'bar' },
            scripts: {
              start: 'react-scripts start',
            },
          },
        ],
      };

      const timestamp = new Date();

      const initialState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs: 'sample output',
        },
      };

      const actualState = reducer(initialState, action);
      const expectedState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start --some-flag=true',
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs: 'sample output',
        },
        'bar-start': {
          projectId: 'bar',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe(ADD_PROJECT, () => {
    it('generates initial task data for a new project', () => {
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

      const timestamp = new Date();

      const initialState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs: 'sample output',
        },
      };

      const actualState = reducer(initialState, action);
      const expectedState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: timestamp,
          logs: 'sample output',
        },
        'bar-start': {
          projectId: 'bar',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe(START_TASK, () => {
    test('marks a task as running', () => {
      const initialState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'idle',
          timeSinceStatusChange: null,
        },
        'foo-build': {
          projectId: 'foo',
          taskName: 'build',
          taskCommand: 'react-scripts build',
          status: 'idle',
          timeSinceStatusChange: null,
        },
      };

      const timestamp = new Date();
      const action = {
        type: START_TASK,
        projectId: 'foo',
        taskName: 'start',
        timestamp,
      };

      const actualState = reducer(initialState, action);
      const expectedState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'running',
          timeSinceStatusChange: timestamp,
        },
        'foo-build': {
          projectId: 'foo',
          taskName: 'build',
          taskCommand: 'react-scripts build',
          status: 'idle',
          timeSinceStatusChange: null,
        },
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe(`ABORT_TASK and COMPLETE_TASK`, () => {
    test('marks a task as idle', () => {
      const initialState = {
        'foo-start': {
          projectId: 'foo',
          taskName: 'start',
          taskCommand: 'react-scripts start',
          status: 'running',
          timeSinceStatusChange: null,
        },
        'foo-build': {
          projectId: 'foo',
          taskName: 'build',
          taskCommand: 'react-scripts build',
          status: 'running',
          timeSinceStatusChange: null,
        },
      };

      const timestamp = new Date();

      // Both ABORT and COMPLETE have the same effect on the state.
      // They're distinct since they have different implications in terms of
      // middleware, but we aren't testing the side-effects of actual
      // task-running.
      const actions = [
        {
          type: ABORT_TASK,
          projectId: 'foo',
          taskName: 'start',
          timestamp,
        },
        {
          type: COMPLETE_TASK,
          projectId: 'foo',
          taskName: 'start',
          timestamp,
        },
      ];

      actions.forEach(action => {
        const actualState = reducer(initialState, action);
        const expectedState = {
          'foo-start': {
            projectId: 'foo',
            taskName: 'start',
            taskCommand: 'react-scripts start',
            status: 'idle',
            timeSinceStatusChange: timestamp,
          },
          'foo-build': {
            projectId: 'foo',
            taskName: 'build',
            taskCommand: 'react-scripts build',
            status: 'running',
            timeSinceStatusChange: null,
          },
        };

        expect(actualState).toEqual(expectedState);
      });
    });
  });
});
