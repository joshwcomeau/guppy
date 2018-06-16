// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import { handleStoreUpdates } from '../services/redux-persistence.service';
import taskMiddleware from '../middlewares/task.middleware';
import dependencyMiddleware from '../middlewares/dependency.middleware';
import importProjectMiddleware from '../middlewares/import-project.middleware';

import DevTools from '../components/DevTools';

export default function configureStore(initialState: any) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunk,
        taskMiddleware,
        dependencyMiddleware,
        importProjectMiddleware
      ),
      DevTools.instrument()
    )
  );

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  // Some slices of the state will be persisted in local-storage,
  // such an onboarding status.
  store.subscribe(() => {
    handleStoreUpdates(store);
  });

  return store;
}
