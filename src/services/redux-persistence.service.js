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
  const { projects, dependencies, tasks, paths } = store.getState();

  updateLocalStorage(JSON.stringify({ projects, dependencies, tasks, paths }));
};

/**
 * getInitialState
 * Builds the initial Redux state, using data in localStorage.
 */
export const getInitialState = () => {
  const reconstructedState = JSON.parse(
    localStorage.getItem(REDUX_STATE_KEY) || '{}'
  );

  // Certain components of the state should be re-initialized.
  // It doesn't matter if the last snapshot of state in the previous session
  // had a running dev-server, that server was closed when Guppy was.
  //
  // NOTE: My initial idea was to do this in `handleStoreUpdates` so that this
  // erroneous data was never committed to localStorage in the first place...
  // but it takes about 8ms of synchronous work time to run (in a test env with
  // only 4 projects).
  // Given that `handleStoreUpdates` runs whenever the redux state changes,
  // this felt too expensive
  if (reconstructedState.tasks) {
    const scrubbedTasks = Object.keys(reconstructedState.tasks).reduce(
      (acc, taskId) => {
        const task = { ...reconstructedState.tasks[taskId] };
        task.status = 'idle';
        task.logs = [];

        return { ...acc, [taskId]: task };
      },
      {}
    );

    reconstructedState.tasks = scrubbedTasks;
  }

  return reconstructedState;
};
