// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import { handleReduxUpdates } from '../services/redux-persistence.service';
import taskMiddleware from '../middlewares/task.middleware';
import rootSaga from '../sagas';

import DevTools from '../components/DevTools';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState: any) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, taskMiddleware, sagaMiddleware),
      DevTools.instrument()
    )
  );

  sagaMiddleware.run(rootSaga);

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  // Some slices of the state will be persisted in local-storage,
  // such an onboarding status.
  store.subscribe(() => {
    handleReduxUpdates(store);
  });

  return store;
}
