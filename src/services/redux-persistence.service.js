import readLocalProjectsFromDisk from './read-local-projects.service';

const REDUX_STATE_KEY = 'redux-state';

/**
 * updateLocalStorage
 * When a non-null value is provided, updates local-storage with the supplied
 * value. When `null` is provided, it erases all previously-stored local-storage
 * data
 */
const updateLocalStorage = value =>
  value !== null
    ? localStorage.setItem(REDUX_STATE_KEY, value)
    : localStorage.removeItem(REDUX_STATE_KEY);

/**
 * handleStoreUpdates
 * Whenever the Redux store updates, we pluck out the state we care about and
 * persist it to localStorage.
 */
export const handleStoreUpdates = function handleStoreUpdates(store) {
  // Because most data that Guppy deals with is written to disk,
  // we only need to store a small slice of the Redux store in localStorage.
  const { onboardingStatus, projects } = store.getState();

  updateLocalStorage(JSON.stringify({ onboardingStatus, projects }));
};

/**
 * getInitialState
 * Builds the initial Redux state, using data in localStorage, as well as the
 * auth token from the cookie. Handles validating and resetting the state as
 * needed.
 */
export const getInitialState = () => {
  return JSON.parse(localStorage.getItem(REDUX_STATE_KEY) || '{}');
};
