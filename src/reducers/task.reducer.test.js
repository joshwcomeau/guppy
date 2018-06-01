import { describe, test } from 'jest';

import { REFRESH_PROJECTS } from '../actions';

import reducer from './task.reducer';

describe('Task reducer', () => {
  describe('refreshProject', () => {
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

      const initialState = reducer();

      const actualState = reducer(initialState, action);
      const expectedState = {
        'foo-start': {
          projectId: 'foo',
          taskId: 'start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
        'bar-start': {
          projectId: 'bar',
          taskId: 'start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
        'baz-start': {
          projectId: 'baz',
          taskId: 'start',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
        'baz-build': {
          projectId: 'baz',
          taskId: 'build',
          status: 'idle',
          timeSinceStatusChange: null,
          logs: null,
        },
      };
    });
  });
});
