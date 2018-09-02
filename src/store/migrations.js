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

import migrate from 'redux-storage-decorator-migrate';

// Update this constant whenever the Redux reducers change in a
// not-backwards-incompatible way:
const STATE_VERSION = 1;

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

export default function handleMigrations(engine: any) {
  engine = migrate(engine, STATE_VERSION);

  engine.addMigration(1, migrateToReduxStorage);

  return engine;
}
