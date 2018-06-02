import { createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import { handleStoreUpdates } from '../services/redux-persistence.service';
import taskMiddleware from '../middlewares/task.middleware';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, taskMiddleware)
  );

  // Commit all relevant changes to the state to localStorage, for quick
  // hydration next visit.
  store.subscribe(() => {
    handleStoreUpdates(store);
  });

  return store;
}
