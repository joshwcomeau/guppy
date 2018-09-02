import { call, put, select, takeEvery } from 'redux-saga/effects';
import ElectronStore from 'electron-store';

import rootSaga, { handleShowResetDialog } from './development.saga';
import { SHOW_RESET_STATE_PROMPT, resetAllState } from '../actions';

describe('development saga', () => {
  describe('root development saga', () => {
    it('should watch for start actions', () => {
      const saga = rootSaga();
      expect(saga.next().value).toEqual(
        takeEvery(SHOW_RESET_STATE_PROMPT, handleShowResetDialog)
      );
    });
  });

  describe('Reset state', () => {
    it('should reset state to initialState', () => {
      const electronStore = new ElectronStore();
      const saga = handleShowResetDialog();

      // Show dialog
      saga.next();

      // Confirm & check that electronStore.clear is called
      // Note: No need to check that the config.json is reset as this is tested in the library - just test that it is called
      expect(saga.next(0).value).toEqual(
        call([electronStore, electronStore.clear])
      );

      // Trigger resetAllState action
      expect(saga.next().value).toEqual(put(resetAllState()));
    });
  });
});
