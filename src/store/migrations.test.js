// @flow
import { migrateToReduxStorage } from './migrations';

const ENGINE_KEY = 'test-key';

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
  });
});
