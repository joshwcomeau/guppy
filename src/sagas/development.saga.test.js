import { call, put, takeEvery } from 'redux-saga/effects';

import { SHOW_RESET_STATE_PROMPT, resetAllState } from '../actions';
import electronStore from '../services/electron-store.service';
import rootSaga, { handleShowResetDialog } from './development.saga';

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
      const saga = handleShowResetDialog();

      // Show dialog
      saga.next();

      // Confirm & check that electronStore.clear is called
      expect(saga.next(0).value).toEqual(
        call([electronStore, electronStore.clear])
      );

      // Trigger resetAllState action
      expect(saga.next().value).toEqual(put(resetAllState()));
    });
  });
});
