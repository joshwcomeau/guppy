// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as storage from 'redux-storage';
import debounce from 'redux-storage-decorator-debounce';
import filter from 'redux-storage-decorator-filter';

import { refreshProjects } from '../actions';
import rootReducer from '../reducers';
import taskMiddleware from '../middlewares/task.middleware';
import dependencyMiddleware from '../middlewares/dependency.middleware';
import importProjectMiddleware from '../middlewares/import-project.middleware';
import createEngine from './storage-engine';
import handleMigrations from './migrations';

import DevTools from '../components/DevTools';

export default function configureStore() {
  // Store all Redux changes in an electron-store, handled by redux-storage.
  let engine = createEngine(
    process.env.NODE_ENV === 'development' ? 'redux-data-dev' : 'redux-data'
  );

  // Handle migrating state as the redux reducers change
  engine = handleMigrations(engine);

  // Batch updates, so that frequent dispatches don't cause performance issues
  engine = debounce(engine, 1000);

  // We don't want to store task info.
  // Tasks
  engine = filter(engine, null, [['tasks']]);
  const storageMiddleware = storage.createMiddleware(engine);

  const wrappedReducer = storage.reducer(rootReducer);

  const store = createStore(
    wrappedReducer,
    compose(
      applyMiddleware(
        thunk,
        taskMiddleware,
        dependencyMiddleware,
        importProjectMiddleware,
        storageMiddleware
      ),
      DevTools.instrument()
    )
  );

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  const load = storage.createLoader(engine);
  load(store)
    .then(newState => {
      // Once our state has been hydrated, we want to refresh the existing
      // projects, so that we can tell if the user has made any changes to
      // the projects (eg. installed dependencies) outside of Guppy.
      store.dispatch(refreshProjects());
    })
    .catch(err => console.error('Failed to load previous state', err));

  return store;
}
