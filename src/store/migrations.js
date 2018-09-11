// @flow
/**
 * Our redux state is persisted from session to session.
 * This is critically important, as Redux is the primary data layer for our
 * application; it keeps track of which projects are managed by Guppy.
 *
 * When we change the reducer structure, we run the risk of breaking existing
 * persisted states. So we use a migration strategy to update user state, when
 * migrating from old versions of the app to new ones.
 *
 * This idea is a bit hard to wrap your head around, but it's similar to
 * database migrations like you'd do in, for example, a Rails app.
 *
 * For more information, see:
 * https://github.com/mathieudutour/redux-storage-decorator-migrate
 */
import * as path from 'path';
import * as os from 'os';
import { windowsHomeDir, isWin } from '../services/platform.service';
import migrate from 'redux-storage-decorator-migrate';

// Update this constant whenever the Redux reducers change in a
// not-backwards-incompatible way:
const STATE_VERSION = 2;

const homedir = isWin ? windowsHomeDir : os.homedir();

export function migrateToReduxStorage(state: any) {
  // 1. UPDATE TO REDUX STORAGE.
  // In initial versions, we had our own bespoke Redux persistence layer.
  // We updated to redux-storage in 0.3.0.
  // While the state shape changed a fair bit, only two migration changes
  // are necessary:
  //
  // - Parse the state, as it was stored previously as a string
  // - Delete `tasks`, which are no longer persisted.
  //
  if (!state) {
    return state;
  }

  const parsedState = typeof state === 'string' ? JSON.parse(state) : state;
  delete parsedState.tasks;

  return parsedState;
}

export function migrateToSupportProjectHomePath(state: any) {
  // 2. UPDATE TO SUPPORT PROJECT_HOME_PATH FEATURE
  //
  // - add homePath, byId field to paths state
  // - migrate values of old paths state to byId field
  if (!state) {
    return state;
  }

  if (state.paths) {
    const {
      paths: { byId: pathsById, homePath },
    } = state;

    if (pathsById && homePath) {
      return state;
    }
  }

  const nextState = {
    ...state,
    paths: {
      homePath:
        process.env.NODE_ENV === 'development'
          ? path.join(homedir, 'guppy-projects-dev')
          : path.join(homedir, 'guppy-projects'),
      byId: state.paths || {},
    },
  };

  return nextState;
}

export function migrateToSupportNestedTaskReducer(state: any) {
  /**
   * 3. SUPPORT NESTED TASK REDUCER STRUCTURE
   *
   * Before, the tasks reducer had a flat structure where each entity had a
   * unique ID:
   *
   *  {
   *    'foo-start': {...},
   *    'foo-build': {...},
   *    'bar-start': {...}
   *  }
   *
   * Now, the tasks reducer is nested, same as our dependencies reducer:
   *
   *  {
   *    foo: {
   *      start: {...},
   *      build: {...}
   *    },
   *    bar: {
   *      start: {...}
   *    }
   *  }
   *
   * As a result, there is no longer an `id` field on tasks; tasks are
   * referenced by a pair of fields now, instead of a single one.
   */
  if (!state || !state.tasks) {
    return state;
  }

  const nextTasks = Object.keys(state.tasks).reduce((acc, taskId) => {
    const task = state.tasks[taskId];

    const { projectId, name } = task;

    // create a clone, so we can delete a no-longer-necessary field
    const taskCopy = { ...task };
    delete taskCopy.id;

    // If this is the first task we've seen for this project, create the
    // object that will hold the tasks.
    if (!acc[projectId]) {
      acc[projectId] = {};
    }

    acc[projectId][name] = taskCopy;

    return acc;
  }, {});

  const nextState = {
    ...state,
    tasks: nextTasks,
  };

  return nextState;
}

export default function handleMigrations(engine: any) {
  engine = migrate(engine, STATE_VERSION);

  engine.addMigration(1, migrateToReduxStorage);
  engine.addMigration(2, migrateToSupportProjectHomePath);

  return engine;
}
