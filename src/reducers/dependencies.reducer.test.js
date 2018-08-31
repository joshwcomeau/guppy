import reducer, { getDependenciesForProjectId } from './dependencies.reducer';
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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
          version: '3.3',
        },
        {
          name: 'react-redux',
          description: 'other description',
          keywords: ['foo', 'bar'],
          version: '3.0',
          homepage: 'https://dependency-homepage2.io',
          license: 'ISC',
          repository: { type: 'git', url: 'https://github.com/bar/foo.git' },
        },
      ],
    };

    expect(reducer(prevState, action)).toMatchSnapshot();
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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

    expect(reducer(prevState, action)).toMatchSnapshot();
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
