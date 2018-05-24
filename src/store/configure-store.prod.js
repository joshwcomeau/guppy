import { createStore } from 'redux';

import rootReducer from '../reducers';
import { handleStoreUpdates } from '../services/redux-persistence.service';

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState);

  // Commit all relevant changes to the state to localStorage, for quick
  // hydration next visit.
  store.subscribe(() => {
    handleStoreUpdates(store);
  });

  return store;
}
