// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import { handleStoreUpdates } from '../services/redux-persistence.service';
import taskMiddleware from '../middlewares/task.middleware';
import dependencyMiddleware from '../middlewares/dependency.middleware';
import importProjectMiddleware from '../middlewares/import-project.middleware';

export default function configureStore(initialState: any) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      taskMiddleware,
      dependencyMiddleware,
      importProjectMiddleware
    )
  );

  // Commit all relevant changes to the state to localStorage, for quick
  // hydration next visit.
  store.subscribe(() => {
    handleStoreUpdates(store);
  });

  return store;
}
