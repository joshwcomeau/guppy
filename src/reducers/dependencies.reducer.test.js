import reducer, { getDependenciesForProjectId } from './dependencies.reducer';
import {
  LOAD_DEPENDENCY_INFO_FROM_DISK,
  ADD_DEPENDENCY_START,
  ADD_DEPENDENCY_ERROR,
  ADD_DEPENDENCY_FINISH,
  UPDATE_DEPENDENCY_START,
  UPDATE_DEPENDENCY_ERROR,
  UPDATE_DEPENDENCY_FINISH,
  DELETE_DEPENDENCY_START,
  DELETE_DEPENDENCY_ERROR,
  DELETE_DEPENDENCY_FINISH,
} from '../actions';
import { isIterable } from 'core-js';

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
    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${ADD_DEPENDENCY_START}`, () => {
    const prevState = {
      foo: {},
    };

    const action = {
      type: ADD_DEPENDENCY_START,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${ADD_DEPENDENCY_ERROR}`, () => {
    const prevState = {
      foo: {
        redux: {},
        'react-router': {},
      },
    };

    const action = {
      type: ADD_DEPENDENCY_ERROR,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${ADD_DEPENDENCY_FINISH}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'installing',
          description: '',
          homepage: '',
          license: '',
          repository: '',
          version: '',
        },
      },
    };

    const action = {
      type: ADD_DEPENDENCY_FINISH,
      projectId: 'foo',
      dependency: {
        name: 'redux',
        status: 'idle',
        description: 'dependency description',
        keywords: ['key', 'words'],
        version: '3.2',
        homepage: 'https://dependency-homepage.io',
        license: 'MIT',
        repository: 'https://github.com',
      },
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${UPDATE_DEPENDENCY_START}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'idle',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: 'https://github.com',
        },
      },
    };

    const action = {
      type: UPDATE_DEPENDENCY_START,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });
  it(`should handle ${UPDATE_DEPENDENCY_ERROR}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'updating',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: 'https://github.com',
        },
      },
    };

    const action = {
      type: UPDATE_DEPENDENCY_ERROR,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${UPDATE_DEPENDENCY_FINISH}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'updating',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: 'https://github.com',
        },
      },
    };

    const action = {
      type: UPDATE_DEPENDENCY_FINISH,
      projectId: 'foo',
      dependencyName: 'redux',
      latestVersion: '4.0',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${DELETE_DEPENDENCY_START}`, () => {
    const prevState = {
      foo: {
        redux: {
          name: 'redux',
          status: 'idle',
          description: 'dependency description',
          keywords: ['key', 'words'],
          version: '3.2',
          homepage: 'https://dependency-homepage.io',
          license: 'MIT',
          repository: 'https://github.com',
        },
      },
    };

    const action = {
      type: DELETE_DEPENDENCY_START,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${DELETE_DEPENDENCY_ERROR}`, () => {
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

    const action = {
      type: DELETE_DEPENDENCY_ERROR,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
  });

  it(`should handle ${DELETE_DEPENDENCY_FINISH}`, () => {
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

    const action = {
      type: DELETE_DEPENDENCY_FINISH,
      projectId: 'foo',
      dependencyName: 'redux',
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
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
    expect(getDependenciesForProjectId('baz', state)).toEqual([]);
  });

  it('should return array of dependencies if they exists', () => {
    expect(getDependenciesForProjectId('foo', state)).toEqual([
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
