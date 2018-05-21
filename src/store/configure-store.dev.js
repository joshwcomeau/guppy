import { createStore, compose, applyMiddleware } from 'redux';

import rootReducer from '../reducers';
import { handleStoreUpdates } from '../helpers/local-storage.helpers';
import createFilesystemMiddleware from '../middlewares/filesystem.middleware';
import DevTools from '../components/DevTools';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(createFilesystemMiddleware()),
      DevTools.instrument()
    )
  );

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  // Commit all relevant changes to the state to localStorage, for quick
  // hydration next visit.
  store.subscribe(() => {
    handleStoreUpdates(store);
  });

  return store;
}
