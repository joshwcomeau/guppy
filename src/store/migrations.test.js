/* eslint-disable flowtype/require-valid-file-annotation */
import {
  migrateToReduxStorage,
  migrateToSupportProjectHomePath,
  migrateToSupportNestedTaskReducer,
} from './migrations';
import rootReducer from '../reducers';

jest.mock('os', () => ({
  homedir: () => 'test',
}));

jest.mock('../services/platform.service', () => ({
  isWin: false,
  windowsHomeDir: 'test',
}));

jest.mock('path', () => ({
  join: () => 'test/guppy-projects',
}));

const getInitialState = () =>
  // Get the initial Redux state by running the reducer with `undefined` state,
  // and a bogus action.
  // (this causes each reducer slice to use the default state value, and to
  // return it since the action won't match.)
  rootReducer(undefined, { type: 'Ahh, this is not a real action' });

describe('Redux migrations', () => {
  describe('Version 0 -> Version 1', () => {
    it('does nothing with no initial state to work with', () => {
      const persistedState = null;

      const expectedOutput = persistedState;
      const actualOutput = migrateToReduxStorage(persistedState);

      expect(actualOutput).toEqual(expectedOutput);
    });

    it('does not affect compatible state', () => {
      const persistedState = {
        projects: {
          byId: {
            hello: {},
            goodbye: {},
          },
        },
      };

      const expectedOutput = persistedState;
      const actualOutput = migrateToReduxStorage(persistedState);

      expect(actualOutput).toEqual(expectedOutput);
    });

    it('handles stringified state, and deletes tasks', () => {
      const persistedState = JSON.stringify({
        projects: {
          byId: {
            hello: {},
            goodbye: {},
          },
        },
        tasks: {
          'hello-start': {},
          'hello-build': {},
          'goodbye-start': {},
          'goodbye-build': {},
        },
      });

      const expectedOutput = {
        projects: {
          byId: {
            hello: {},
            goodbye: {},
          },
        },
      };
      const actualOutput = migrateToReduxStorage(persistedState);

      expect(actualOutput).toEqual(expectedOutput);
    });

    it('builds without crashing', () => {
      let state = getInitialState();

      expect(() => migrateToReduxStorage(state)).not.toThrow();
    });
  });

  describe('Version 1 -> Version 2', () => {
    it('does nothing with no initial state to work with', () => {
      const persistedState = null;

      const expectedOutput = persistedState;
      const actualOutput = migrateToSupportProjectHomePath(persistedState);

      expect(actualOutput).toEqual(expectedOutput);
    });

    it('handles old paths state', () => {
      const persistedState = {
        paths: {
          hello: 'hello',
          goodbye: 'goodbye',
        },
      };

      const expectedOutput = {
        paths: {
          homePath: 'test/guppy-projects',
          byId: {
            hello: 'hello',
            goodbye: 'goodbye',
          },
        },
      };
      const actualOutput = migrateToSupportProjectHomePath(persistedState);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('does not affect compatible state', () => {
      const persistedState = {
        paths: {
          homePath: 'test',
          byId: {
            hello: 'hello',
            goodbye: 'goodbye',
          },
        },
      };

      const expectedOutput = persistedState;
      const actualOutput = migrateToSupportProjectHomePath(persistedState);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('builds without crashing', () => {
      let state = getInitialState();

      expect(() => migrateToReduxStorage(state)).not.toThrow();
      state = migrateToReduxStorage(state);

      expect(() => migrateToSupportProjectHomePath(state)).not.toThrow();
    });
  });

  describe('Version 2 -> Version 3', () => {
    it('does nothing with no initial state to work with', () => {
      const persistedState = null;

      const expectedOutput = persistedState;
      const actualOutput = migrateToSupportNestedTaskReducer(persistedState);

      expect(actualOutput).toEqual(expectedOutput);
    });

    it('does not affect state without tasks', () => {
      const persistedState = {
        projects: {
          hello: {
            name: 'hello',
          },
        },
      };

      const expectedOutput = persistedState;
      const actualOutput = migrateToSupportNestedTaskReducer(persistedState);

      expect(actualOutput).toEqual(expectedOutput);
    });

    it('converts task state', () => {
      const persistedState = {
        tasks: {
          'my-wonderful-project-start': {
            id: 'my-wonderful-project-start',
            projectId: 'my-wonderful-project',
            name: 'start',
            command: 'react-scripts start',
          },
          'my-wonderful-project-build': {
            id: 'my-wonderful-project-build',
            projectId: 'my-wonderful-project',
            name: 'build',
            command: 'react-scripts build',
          },
          'another-lovely-project-start': {
            id: 'another-lovely-project-start',
            projectId: 'another-lovely-project',
            name: 'start',
            command: 'react-scripts start',
          },
        },
      };

      const expectedOutput = {
        tasks: {
          'my-wonderful-project': {
            start: {
              projectId: 'my-wonderful-project',
              name: 'start',
              command: 'react-scripts start',
            },
            build: {
              projectId: 'my-wonderful-project',
              name: 'build',
              command: 'react-scripts build',
            },
          },
          'another-lovely-project': {
            start: {
              projectId: 'another-lovely-project',
              name: 'start',
              command: 'react-scripts start',
            },
          },
        },
      };

      const actualOutput = migrateToSupportNestedTaskReducer(persistedState);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('builds without crashing', () => {
      let state = getInitialState();

      expect(() => migrateToReduxStorage(state)).not.toThrow();
      state = migrateToReduxStorage(state);

      expect(() => migrateToSupportProjectHomePath(state)).not.toThrow();
      state = migrateToSupportProjectHomePath(state);

      expect(() => migrateToSupportNestedTaskReducer(state)).not.toThrow();
    });
  });
});
