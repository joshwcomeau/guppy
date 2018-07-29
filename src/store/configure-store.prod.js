// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import { handleReduxUpdates } from '../services/redux-persistence.service';
import taskMiddleware from '../middlewares/task.middleware';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState: any) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, taskMiddleware, sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);

  // Allow direct access to the store, for debugging/testing
  // Doing this in production as well for the simple reason that this app is
  // distributed to developers, and they may want to tinker with this :)
  window.store = store;

  // Commit all relevant changes to the state to localStorage, for quick
  // hydration next visit.
  store.subscribe(() => {
    handleReduxUpdates(store);
  });

  return store;
}
