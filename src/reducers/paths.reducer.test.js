import reducer, { initialState } from './paths.reducer';
import {
  IMPORT_EXISTING_PROJECT_FINISH,
  ADD_PROJECT,
  SAVE_PROJECT_SETTINGS_FINISH,
  CHANGE_PROJECT_HOME_PATH,
  FINISH_DELETING_PROJECT,
  RESET_ALL_STATE,
} from '../actions';

// The paths reducer initial state chooses a platform-specific home path.
// To avoid dealing with all that, we'll just supply an initial state in
// all tests
const platformSafeInitialState = {
  homePath: 'path/to/projects',
  byId: {},
};

describe('Tasks reducer', () => {
  it('should return initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe(ADD_PROJECT, () => {
    it('adds path info for new projects', () => {
      const prevState = platformSafeInitialState;

      const action = {
        type: ADD_PROJECT,
        project: {
          name: 'Hello World',
          guppy: { id: 'fds8fd7s97f', name: 'hello-world' },
          scripts: {
            start: 'react-scripts start',
          },
        },
      };

      expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "byId": Object {
    "fds8fd7s97f": "path/to/projects/hello-world",
  },
  "homePath": "path/to/projects",
}
`);
    });
  });

  describe(IMPORT_EXISTING_PROJECT_FINISH, () => {
    it('adds path info for imported projects', () => {
      const prevState = platformSafeInitialState;

      const action = {
        type: IMPORT_EXISTING_PROJECT_FINISH,
        project: {
          name: 'hello-world',
          guppy: { id: 'abc123456789', name: 'Hello World' },
          scripts: {
            start: 'react-scripts start',
          },
        },
        projectPath: 'Users/john_doe/work',
      };

      expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "byId": Object {
    "abc123456789": "Users/john_doe/work",
  },
  "homePath": "path/to/projects",
}
`);
    });
  });

  describe(SAVE_PROJECT_SETTINGS_FINISH, () => {
    it('saves a new path for an existing project', () => {
      const prevState = {
        ...platformSafeInitialState,
        byId: {
          xyz789: 'some/outdated/path',
        },
      };

      const action = {
        type: SAVE_PROJECT_SETTINGS_FINISH,
        project: {
          name: 'goodbye-world',
          guppy: { id: 'xyz789', name: 'Goodbye World' },
          scripts: {
            start: 'react-scripts start',
          },
        },
        projectPath: 'Users/john_doe/work',
      };

      expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "byId": Object {
    "xyz789": "Users/john_doe/work",
  },
  "homePath": "path/to/projects",
}
`);
    });
  });

  describe(CHANGE_PROJECT_HOME_PATH, () => {
    it('updates the `homePath` field', () => {
      const prevState = {
        byId: {
          abcxyz: 'this/is/home',
        },
        homePath: 'this/is/home',
      };

      const action = {
        type: CHANGE_PROJECT_HOME_PATH,
        homePath: 'Users/john_doe/work',
      };

      expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "byId": Object {
    "abcxyz": "this/is/home",
  },
  "homePath": "Users/john_doe/work",
}
`);
    });
  });

  describe(FINISH_DELETING_PROJECT, () => {
    it('removes the specified project ID from `byId`', () => {
      const prevState = {
        ...platformSafeInitialState,
        byId: {
          abcxyz: 'this/is/home',
          defuvw: 'this/is/home',
        },
      };

      const action = {
        type: FINISH_DELETING_PROJECT,
        projectId: 'defuvw',
      };

      expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "byId": Object {
    "abcxyz": "this/is/home",
  },
  "homePath": "path/to/projects",
}
`);
    });
  });

  describe(RESET_ALL_STATE, () => {
    it('restores the original state', () => {
      const prevState = {
        ...platformSafeInitialState,
        byId: {
          abcxyz: 'this/is/home',
          defuvw: 'this/is/home',
        },
      };

      const action = { type: RESET_ALL_STATE };

      expect(reducer(prevState, action)).toEqual(initialState);
    });
  });
});
