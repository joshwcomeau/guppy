import ElectronStore from 'electron-store';

const electronStore = new ElectronStore();

const REDUX_STATE_KEY =
  process.env.NODE_ENV === 'development' ? 'redux-state-dev' : 'redux-state';

// While debugging, it's helpful to be able to access the store.
// This should only be used for debugging, don't write any code that uses this!
window.electronStore = electronStore;
/**
 * updateElectronStore
 * When a non-null value is provided, updates the electronStore with the
 * supplied value. When `null` is provided, it erases all previously-stored data
 */
const updateElectronStore = value =>
  value !== null
    ? electronStore.set(REDUX_STATE_KEY, value)
    : electronStore.delete(REDUX_STATE_KEY);

/**
 * handleReduxUpdates
 * Whenever the Redux store updates, we pluck out the state we care about and
 * persist it to localStorage.
 */
export const handleReduxUpdates = reduxStore => {
  const { projects, dependencies, tasks, paths } = reduxStore.getState();

  updateElectronStore(JSON.stringify({ projects, dependencies, tasks, paths }));
};

/**
 * getInitialState
 * Builds the initial Redux state, using data in localStorage.
 */
export const getInitialState = () => {
  const reconstructedState = JSON.parse(
    electronStore.get(REDUX_STATE_KEY) || '{}'
  );

  // Certain components of the state should be re-initialized.
  // It doesn't matter if the last snapshot of state in the previous session
  // had a running dev-server, that server was closed when Guppy was.
  //
  // NOTE: My initial idea was to do this in `handleReduxUpdates` so that this
  // erroneous data was never committed to localStorage in the first place...
  // but it takes about 8ms of synchronous work time to run (in a test env with
  // only 4 projects).
  // Given that `handleReduxUpdates` runs whenever the redux state changes,
  // this felt too expensive
  //
  // TODO: It occurs to me that if the user closes the window, they may not be
  // quitting the app. Maybe we do want to persist task info, so that tasks
  // won't be interrupted when the window closes..?
  if (reconstructedState.tasks) {
    const scrubbedTasks = Object.keys(reconstructedState.tasks).reduce(
      (acc, taskId) => {
        const task = { ...reconstructedState.tasks[taskId] };
        task.status = 'idle';
        task.processId = null;
        task.logs = [];

        return { ...acc, [taskId]: task };
      },
      {}
    );

    reconstructedState.tasks = scrubbedTasks;
  }

  return reconstructedState;
};
