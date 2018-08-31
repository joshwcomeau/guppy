// @flow
import produce from 'immer';
import {
  QUEUE_DEPENDENCY_INSTALL,
  QUEUE_DEPENDENCY_UNINSTALL,
  START_NEXT_ACTION_IN_QUEUE,
} from '../actions';

import type { Action } from 'redux';
import type { Dependency, QueueAction } from '../actions';

// Installing a new dependency and updating an existing one
// both use the same yarn command (yarn add) and as such can
// be bulked together into a single install. However, we want
// to display either 'Installing...' or 'Updating...', respectively,
// so we have to track the install's purpose per dependency in
// the install queue
type QueuedDependency = Dependency & { updating?: boolean };

type State = {
  [projectId: string]: Array<{
    action: QueueAction,
    dependencies: Array<QueuedDependency>,
  }>,
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case START_NEXT_ACTION_IN_QUEUE: {
      const { projectId } = action;

      return produce(state, draftState => {
        // remove oldest item in queue (it's just been
        // completed by the dependency saga)
        draftState[projectId].shift();

        // remove the project's queue if this was the
        // last entry
        if (draftState[projectId].length === 0) {
          delete draftState[projectId];
        }
      });
    }

    case QUEUE_DEPENDENCY_INSTALL: {
      const { projectId, name, version, updating } = action;

      return produce(state, draftState => {
        // get existing project queue, or create it if this
        // is the first entry
        const projectQueue = draftState[projectId] || [];

        // get existing install queue for this project, or
        // create it if it doesn't exist
        let installQueue = projectQueue.find(q => q.action === 'install');
        if (!installQueue) {
          installQueue = {
            action: 'install',
            dependencies: [],
          };
          projectQueue.push(installQueue);
        }

        // add dependency to the install queue
        installQueue.dependencies.push({
          name,
          version,
          updating,
        });

        // update the project's install queue
        draftState[projectId] = projectQueue;
      });
    }

    case QUEUE_DEPENDENCY_UNINSTALL: {
      const { projectId, name } = action;

      return produce(state, draftState => {
        // get existing project queue, or create it if this
        // is the first entry
        const projectQueue = draftState[projectId] || [];

        // get existing uninstall queue for this project, or
        // create it if it doesn't exist
        let installQueue = projectQueue.find(q => q.action === 'uninstall');
        if (!installQueue) {
          installQueue = {
            action: 'uninstall',
            dependencies: [],
          };
          projectQueue.push(installQueue);
        }

        // add dependency to the uninstall queue
        installQueue.dependencies.push({
          name,
        });

        // update the project's uninstall queue
        draftState[projectId] = projectQueue;
      });
    }

    default:
      return state;
  }
};

//
//
//
// Selectors
export const getPackageJsonLockedForProjectId = (
  state: any,
  projectId: string
) => !!state.queue[projectId];
