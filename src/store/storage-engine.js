// @flow
/**
 * This is a modified version of redux-storage-engine-electron-store
 * (https://github.com/collmot/redux-storage-engine-electron-store)
 *
 * This fork does two things:
 * - Exposes the created Electron store on the `window`, for debugging
 * - Simplifies a bit by assuming a `key` will be provided, and no
 *   modifications to the store are required.
 */

import electronStore from '../services/electron-store.service';

function rejectWithMessage(error) {
  return Promise.reject(error.message);
}

export default function createEngine(key: string) {
  window.electronStore = electronStore;

  return {
    load: () =>
      new Promise(resolve => {
        resolve(electronStore.get(key) || {});
      }).catch(rejectWithMessage),

    save: (state: any) =>
      new Promise(resolve => {
        electronStore.set(key, state);
      }).catch(rejectWithMessage),
  };
}
