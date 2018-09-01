// @flow
import produce from 'immer';
import {
  QUEUE_DEPENDENCY_INSTALL,
  QUEUE_DEPENDENCY_UNINSTALL,
  INSTALL_DEPENDENCIES_START,
  UNINSTALL_DEPENDENCIES_START,
  START_NEXT_ACTION_IN_QUEUE,
} from '../actions';

import type { Action } from 'redux';
import type { QueuedDependency, QueueAction } from '../types';

type State = {
  [projectId: string]: Array<{
    action: QueueAction,
    active: boolean,
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
        let installQueue = projectQueue.find(
          q => q.action === 'install' && !q.active
        );
        if (!installQueue) {
          installQueue = {
            action: 'install',
            active: false,
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
        let installQueue = projectQueue.find(
          q => q.action === 'uninstall' && !q.active
        );
        if (!installQueue) {
          installQueue = {
            action: 'uninstall',
            active: false,
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

    case INSTALL_DEPENDENCIES_START:
    case UNINSTALL_DEPENDENCIES_START: {
      const { projectId } = action;

      return produce(state, draftState => {
        // mark the next item in the queue as active
        draftState[projectId][0].active = true;
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

export const getNextActionForProjectId = (state: any, projectId: string) =>
  state.queue[projectId] && state.queue[projectId][0];
