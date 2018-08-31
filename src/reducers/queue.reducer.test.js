import reducer, { getPackageJsonLockedForProjectId } from './queue.reducer';
import {
  QUEUE_DEPENDENCY_INSTALL,
  QUEUE_DEPENDENCY_UNINSTALL,
  START_NEXT_ACTION_IN_QUEUE,
} from '../actions';

describe('queue reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it(`should handle ${START_NEXT_ACTION_IN_QUEUE} for queue with next action`, () => {
    const prevState = {
      foo: [
        { action: 'install', dependencies: [{ name: 'redux' }] },
        { action: 'uninstall', dependencies: [{ name: 'react-redux' }] },
      ],
    };

    const action = {
      type: START_NEXT_ACTION_IN_QUEUE,
      projectId: 'foo',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${START_NEXT_ACTION_IN_QUEUE} for queue with no more actions`, () => {
    const prevState = {
      foo: [{ action: 'install', dependencies: [{ name: 'redux' }] }],
    };

    const action = {
      type: START_NEXT_ACTION_IN_QUEUE,
      projectId: 'foo',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${QUEUE_DEPENDENCY_INSTALL} for new dependency on empty queue`, () => {
    const prevState = {};

    const action = {
      type: QUEUE_DEPENDENCY_INSTALL,
      projectId: 'foo',
      name: 'redux',
      version: '3.2',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${QUEUE_DEPENDENCY_INSTALL} for new dependency on existing queue`, () => {
    const prevState = {
      foo: [
        {
          action: 'install',
          dependencies: [{ name: 'react-redux' }],
        },
      ],
    };

    const action = {
      type: QUEUE_DEPENDENCY_INSTALL,
      projectId: 'foo',
      name: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${QUEUE_DEPENDENCY_INSTALL} for updating dependency`, () => {
    const prevState = {};

    const action = {
      type: QUEUE_DEPENDENCY_INSTALL,
      projectId: 'foo',
      name: 'redux',
      version: '3.3',
      updating: true,
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${QUEUE_DEPENDENCY_UNINSTALL}`, () => {
    const prevState = {};

    const action = {
      type: QUEUE_DEPENDENCY_UNINSTALL,
      projectId: 'foo',
      name: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${QUEUE_DEPENDENCY_INSTALL} for mixed existing queue`, () => {
    const prevState = {
      foo: [
        { action: 'install', dependencies: [{ name: 'react-redux' }] },
        { action: 'uninstall', dependencies: [{ name: 'redux' }] },
      ],
    };

    const action = {
      type: QUEUE_DEPENDENCY_INSTALL,
      projectId: 'foo',
      name: 'lodash',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${QUEUE_DEPENDENCY_UNINSTALL} for mixed existing queue`, () => {
    const prevState = {
      foo: [
        { action: 'install', dependencies: [{ name: 'react-redux' }] },
        { action: 'uninstall', dependencies: [{ name: 'redux' }] },
      ],
    };

    const action = {
      type: QUEUE_DEPENDENCY_UNINSTALL,
      projectId: 'foo',
      name: 'lodash',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  describe('getPackageJsonLockedForProjectId', () => {
    it('should return false when no dependencies are queued', () => {
      const state = {
        queue: {},
      };

      const projectId = 'foo';

      expect(getPackageJsonLockedForProjectId(state, projectId)).toBe(false);
    });

    it('should return true when dependencies are queued', () => {
      const state = {
        queue: {
          foo: [
            {
              action: 'install',
              dependencies: [{ name: 'redux' }],
            },
          ],
        },
      };

      const projectId = 'foo';

      expect(getPackageJsonLockedForProjectId(state, projectId)).toBe(true);
    });
  });
});
