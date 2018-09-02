import { remote } from 'electron';
import { call, put, takeEvery } from 'redux-saga/effects';
import { SHOW_RESET_STATE_PROMPT, resetAllState } from '../actions';

import ElectronStore from 'electron-store';

const { dialog } = remote;

export function* showResetDialog(): Saga<void> {
  const response = yield call([dialog, dialog.showMessageBox], {
    type: 'warning',
    buttons: ['Reset', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
    title: `Reset state`,
    message: `Are you sure you want to reset your application state?`,
    detail: `All your imported & created projects are removed from the application.\nThey're still on your disk but you need to re-import them. Only use this if you're having problems with a broken application state`,
  });

  const confirmed = response === 0;
  if (confirmed) {
    console.log('store clear', window.electronStore.clear);
    window.electronStore.clear();
    yield put(resetAllState());
  }
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery(SHOW_RESET_STATE_PROMPT, showResetDialog);
}
