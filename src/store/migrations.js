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

const STATE_VERSION = 1;

export default function handleMigrations(engine: any) {
  engine = migrate(engine, STATE_VERSION);

  engine.addMigration(1, state => {
    // TODO: mutate state here as needed.
    return state;
  });

  return engine;
}
