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
  // Omit modals and flash messages, we don't want to rehydrate this.
  // We also omit the calendar, since presumably you care more about the present week,
  // not the week you were looking at last time.
  const { ...relevantState } = store.getState();

  updateLocalStorage(JSON.stringify(relevantState));
};

/**
 * getInitialState
 * Builds the initial Redux state, using data in localStorage, as well as the
 * auth token from the cookie. Handles validating and resetting the state as
 * needed.
 */
export const getInitialState = defaultState =>
  JSON.parse(localStorage.getItem(REDUX_STATE_KEY) || '{}');
