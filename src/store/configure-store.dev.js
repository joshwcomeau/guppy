import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import { handleStoreUpdates } from '../services/redux-persistence.service';
import DevTools from '../components/DevTools';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
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
