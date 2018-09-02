import reducer, {
  getDependenciesForProjectId,
  initialState as dependenciesInitialState,
} from './dependencies.reducer';
import {
  LOAD_DEPENDENCY_INFO_FROM_DISK,
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  INSTALL_DEPENDENCIES_START,
  INSTALL_DEPENDENCIES_ERROR,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_START,
  UNINSTALL_DEPENDENCIES_ERROR,
  UNINSTALL_DEPENDENCIES_FINISH,
  RESET_ALL_STATE,
} from '../actions';

describe('dependencies reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it(`should handle ${LOAD_DEPENDENCY_INFO_FROM_DISK}`, () => {
    const prevState = {
      baz: {},
    };

    const action = {
      type: LOAD_DEPENDENCY_INFO_FROM_DISK,
      projectId: 'foo',
      dependencies: { redux: {} },
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "baz": Object {},
  "foo": Object {
    "redux": Object {},
  },
}
`);
  });

  it(`should handle ${ADD_DEPENDENCY}`, () => {
    const prevState = {
      foo: {},
    };

    const action = {
      type: ADD_DEPENDENCY,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "redux": Object {
      "description": "",
      "homepage": "",
      "license": "",
      "location": "dependencies",
      "name": "redux",
      "repository": Object {
        "type": "",
        "url": "",
      },
      "status": "queued-install",
      "version": "",
    },
  },
}
`);
  });

  it(`should handle ${UPDATE_DEPENDENCY}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'idle',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
      },
    };

    const action = {
      type: UPDATE_DEPENDENCY,
      projectId: 'foo',
      dependencyName: 'redux',
      latestVersion: '3.3',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "redux": Object {
      "description": "dependency description",
      "homepage": "https://dependency-homepage.io",
      "keywords": Array [
        "key",
        "words",
      ],
      "license": "MIT",
      "location": "dependencies",
      "name": "redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/foo/bar.git",
      },
      "status": "queued-update",
      "version": "3.2",
    },
  },
}
`);
  });

  it(`should handle ${DELETE_DEPENDENCY}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'idle',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
      },
    };

    const action = {
      type: DELETE_DEPENDENCY,
      projectId: 'foo',
      dependencyName: 'redux',
      latestVersion: '3.3',
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "redux": Object {
      "description": "dependency description",
      "homepage": "https://dependency-homepage.io",
      "keywords": Array [
        "key",
        "words",
      ],
      "license": "MIT",
      "location": "dependencies",
      "name": "redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/foo/bar.git",
      },
      "status": "queued-delete",
      "version": "3.2",
    },
  },
}
`);
  });

  it(`should handle ${INSTALL_DEPENDENCIES_START}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'queued-update',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
        'react-redux': {
          name: 'react-redux',
          status: 'queued-install',
          location: 'dependencies',
          description: '',
          version: '',
          homepage: '',
          license: '',
          repository: { type: '', url: '' },
        },
      },
    };

    const action = {
      type: INSTALL_DEPENDENCIES_START,
      projectId: 'foo',
      dependencies: [
        {
          name: 'redux',
          version: '3.3',
          updating: true,
        },
        {
          name: 'react-redux',
        },
      ],
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "react-redux": Object {
      "description": "",
      "homepage": "",
      "license": "",
      "location": "dependencies",
      "name": "react-redux",
      "repository": Object {
        "type": "",
        "url": "",
      },
      "status": "installing",
      "version": "",
    },
    "redux": Object {
      "description": "dependency description",
      "homepage": "https://dependency-homepage.io",
      "keywords": Array [
        "key",
        "words",
      ],
      "license": "MIT",
      "location": "dependencies",
      "name": "redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/foo/bar.git",
      },
      "status": "updating",
      "version": "3.2",
    },
  },
}
`);
  });

  it(`should handle ${INSTALL_DEPENDENCIES_ERROR}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'queued-update',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
        'react-redux': {
          name: 'react-redux',
          status: 'queued-install',
          location: 'dependencies',
          description: '',
          version: '',
          homepage: '',
          license: '',
          repository: { type: '', url: '' },
        },
      },
    };

    const action = {
      type: INSTALL_DEPENDENCIES_ERROR,
      projectId: 'foo',
      dependencies: [
        {
          name: 'redux',
          version: '3.3',
          updating: true,
        },
        {
          name: 'react-redux',
        },
      ],
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "redux": Object {
      "description": "dependency description",
      "homepage": "https://dependency-homepage.io",
      "keywords": Array [
        "key",
        "words",
      ],
      "license": "MIT",
      "location": "dependencies",
      "name": "redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/foo/bar.git",
      },
      "status": "idle",
      "version": "3.2",
    },
  },
}
`);
  });

  it(`should handle ${INSTALL_DEPENDENCIES_FINISH}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'queued-update',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
        'react-redux': {
          name: 'react-redux',
          status: 'queued-install',
          location: 'dependencies',
          description: '',
          version: '',
          homepage: '',
          license: '',
          repository: { type: '', url: '' },
        },
      },
    };

    const action = {
      type: INSTALL_DEPENDENCIES_FINISH,
      projectId: 'foo',
      dependencies: [
        {
          name: 'redux',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.3',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
        {
          name: 'react-redux',
          location: 'dependencies',
          description: 'other description',
          keywords: ['foo', 'bar'],
          version: '3.0',
          homepage: 'https://dependency-homepage2.io',
          license: 'ISC',
          repository: { type: 'git', url: 'https://github.com/bar/foo.git' },
        },
      ],
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "react-redux": Object {
      "description": "other description",
      "homepage": "https://dependency-homepage2.io",
      "keywords": Array [
        "foo",
        "bar",
      ],
      "license": "ISC",
      "location": "dependencies",
      "name": "react-redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/bar/foo.git",
      },
      "status": "idle",
      "version": "3.0",
    },
    "redux": Object {
      "description": "dependency description",
      "homepage": "https://dependency-homepage.io",
      "keywords": Array [
        "key",
        "words",
      ],
      "license": "MIT",
      "location": "dependencies",
      "name": "redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/foo/bar.git",
      },
      "status": "idle",
      "version": "3.3",
    },
  },
}
`);
  });

  it(`should handle ${UNINSTALL_DEPENDENCIES_START}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'queued-delete',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
      },
    };

    const action = {
      type: UNINSTALL_DEPENDENCIES_START,
      projectId: 'foo',
      dependencies: [
        {
          name: 'redux',
        },
      ],
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "redux": Object {
      "description": "dependency description",
      "homepage": "https://dependency-homepage.io",
      "keywords": Array [
        "key",
        "words",
      ],
      "license": "MIT",
      "name": "redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/foo/bar.git",
      },
      "status": "deleting",
      "version": "3.2",
    },
  },
}
`);
  });

  it(`should handle ${UNINSTALL_DEPENDENCIES_ERROR}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'queued-delete',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
      },
    };

    const action = {
      type: UNINSTALL_DEPENDENCIES_ERROR,
      projectId: 'foo',
      dependencies: [
        {
          name: 'redux',
        },
      ],
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {
    "redux": Object {
      "description": "dependency description",
      "homepage": "https://dependency-homepage.io",
      "keywords": Array [
        "key",
        "words",
      ],
      "license": "MIT",
      "location": "dependencies",
      "name": "redux",
      "repository": Object {
        "type": "git",
        "url": "https://github.com/foo/bar.git",
      },
      "status": "idle",
      "version": "3.2",
    },
  },
}
`);
  });

  it(`should handle ${UNINSTALL_DEPENDENCIES_FINISH}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'queued-delete',
          location: 'dependencies',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: { type: 'git', url: 'https://github.com/foo/bar.git' },
        },
      },
    };

    const action = {
      type: UNINSTALL_DEPENDENCIES_FINISH,
      projectId: 'foo',
      dependencies: [
        {
          name: 'redux',
        },
      ],
    };

    expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "foo": Object {},
}
`);
  });

  test('reset to initialState on RESET_ALL_STATE action', () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'deleting',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: 'https://github.com',
        },
      },
    };
    const action = { type: RESET_ALL_STATE };
    const actualState = reducer(prevState, action);

    expect(actualState).toEqual(dependenciesInitialState);
  });
});

describe('getDependenciesForProjectId selector', () => {
  const state = {
    dependencies: {
      foo: {
        react: {
          name: 'react',
          status: 'idle',
        },
        redux: {
          name: 'redux',
          status: 'idle',
        },
        'react-dom': {
          name: 'react-dom',
          status: 'idle',
        },
      },
    },
  };

  it('should return empty array if project has not dependencies', () => {
    expect(getDependenciesForProjectId(state, 'baz')).toEqual([]);
  });

  it('should return array of dependencies if they exists', () => {
    expect(getDependenciesForProjectId(state, 'foo')).toEqual([
      {
        name: 'react',
        status: 'idle',
      },
      {
        name: 'react-dom',
        status: 'idle',
      },
      {
        name: 'redux',
        status: 'idle',
      },
    ]);
  });
});
