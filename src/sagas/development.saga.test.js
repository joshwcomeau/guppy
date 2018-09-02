import { call, put, select, takeEvery } from 'redux-saga/effects';

import rootSaga, { showResetDialog } from './development.saga';

import { SHOW_RESET_STATE_PROMPT, resetAllState } from '../actions';

describe('development saga', () => {
  describe('root development saga', () => {
    it('should watch for start actions', () => {
      const saga = rootSaga();
      expect(saga.next().value).toEqual(
        takeEvery(SHOW_RESET_STATE_PROMPT, showResetDialog)
      );
    });
  });

  describe('Reset state', () => {
    it('should reset state to initialState', () => {
      if (!window.electronStore) {
        window = { electronStore: { clear: jest.fn() } };
      }

      const saga = showResetDialog();

      // Show dialog
      saga.next();

      // Confirm dialog & trigger resetAll
      expect(saga.next(0).value).toEqual(put(resetAllState()));

      // Check that electronStore.clear is called
      // Note: No need to check that the config.json is reset as this is tested in the library - just test that it is called
      expect(window.electronStore.clear).toBeCalled();
    });
  });
});
