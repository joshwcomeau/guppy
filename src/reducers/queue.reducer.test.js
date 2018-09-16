import reducer, { getNextActionForProjectId } from './queue.reducer';
import {
  QUEUE_DEPENDENCY_INSTALL,
  QUEUE_DEPENDENCY_UNINSTALL,
  INSTALL_DEPENDENCIES_START,
  INSTALL_DEPENDENCIES_FINISH,
} from '../actions';

describe('queue reducer', () => {
  it('should return initial state', () => {
    expect(reducer()).toEqual({});
  });

  it(`should handle queue item start`, () => {
    const prevState = {
      foo: [
        { action: 'install', active: false, dependencies: [{ name: 'redux' }] },
      ],
    };

    const action = {
      type: INSTALL_DEPENDENCIES_START,
      projectId: 'foo',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "install",
      "active": true,
      "dependencies": Array [
        Object {
          "name": "redux",
        },
      ],
    },
  ],
}
`);
  });

  it(`should handle queue item completion for queue with next action`, () => {
    const prevState = {
      foo: [
        { action: 'install', dependencies: [{ name: 'redux' }] },
        { action: 'uninstall', dependencies: [{ name: 'react-redux' }] },
      ],
    };

    const action = {
      type: INSTALL_DEPENDENCIES_FINISH,
      projectId: 'foo',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "uninstall",
      "dependencies": Array [
        Object {
          "name": "react-redux",
        },
      ],
    },
  ],
}
`);
  });

  it(`should handle queue item completion for queue with no more actions`, () => {
    const prevState = {
      foo: [{ action: 'install', dependencies: [{ name: 'redux' }] }],
    };

    const action = {
      type: INSTALL_DEPENDENCIES_FINISH,
      projectId: 'foo',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`Object {}`);
  });

  it(`should handle ${QUEUE_DEPENDENCY_INSTALL} for new dependency on empty queue`, () => {
    const prevState = {};

    const action = {
      type: QUEUE_DEPENDENCY_INSTALL,
      projectId: 'foo',
      name: 'redux',
      version: '3.2',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "install",
      "active": false,
      "dependencies": Array [
        Object {
          "name": "redux",
          "updating": undefined,
          "version": "3.2",
        },
      ],
    },
  ],
}
`);
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

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "install",
      "dependencies": Array [
        Object {
          "name": "react-redux",
        },
        Object {
          "name": "redux",
          "updating": undefined,
          "version": undefined,
        },
      ],
    },
  ],
}
`);
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

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "install",
      "active": false,
      "dependencies": Array [
        Object {
          "name": "redux",
          "updating": true,
          "version": "3.3",
        },
      ],
    },
  ],
}
`);
  });

  it(`should handle ${QUEUE_DEPENDENCY_UNINSTALL}`, () => {
    const prevState = {};

    const action = {
      type: QUEUE_DEPENDENCY_UNINSTALL,
      projectId: 'foo',
      name: 'redux',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "uninstall",
      "active": false,
      "dependencies": Array [
        Object {
          "name": "redux",
        },
      ],
    },
  ],
}
`);
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

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "install",
      "dependencies": Array [
        Object {
          "name": "react-redux",
        },
        Object {
          "name": "lodash",
          "updating": undefined,
          "version": undefined,
        },
      ],
    },
    Object {
      "action": "uninstall",
      "dependencies": Array [
        Object {
          "name": "redux",
        },
      ],
    },
  ],
}
`);
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

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Array [
    Object {
      "action": "install",
      "dependencies": Array [
        Object {
          "name": "react-redux",
        },
      ],
    },
    Object {
      "action": "uninstall",
      "dependencies": Array [
        Object {
          "name": "redux",
        },
        Object {
          "name": "lodash",
        },
      ],
    },
  ],
}
`);
  });

  describe('getNextActionForProjectId', () => {
    it('should return next action when one is present', () => {
      const state = {
        queue: {
          foo: [{ action: 'install', dependencies: [{ name: 'redux' }] }],
        },
      };

      const projectId = 'foo';

      expect(getNextActionForProjectId(state, { projectId }))
        .toMatchInlineSnapshot(`
Object {
  "action": "install",
  "dependencies": Array [
    Object {
      "name": "redux",
    },
  ],
}
`);
    });

    it('should return undefined when no actions are present', () => {
      const state = {
        queue: {},
      };

      const projectId = 'foo';

      expect(getNextActionForProjectId(state, { projectId })).toBe(undefined);
    });
  });
});
