// @flow
import {
  migrateToReduxStorage,
  migrateToSupportProjectHomePath,
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

const FAKE_ACTION = 'AHH THIS IS NOT A REAL ACTION';

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
      let state = rootReducer(undefined, { type: FAKE_ACTION });

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
      let state = rootReducer(undefined, { type: FAKE_ACTION });

      expect(() => migrateToReduxStorage(state)).not.toThrow();
      state = migrateToReduxStorage(state);

      expect(() => migrateToSupportProjectHomePath(state)).not.toThrow();
    });
  });
});
