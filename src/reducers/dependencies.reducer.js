// @flow
import produce from 'immer';
import {
  LOAD_DEPENDENCY_INFO_FROM_DISK,
  DELETE_DEPENDENCY_START,
  DELETE_DEPENDENCY_ERROR,
  DELETE_DEPENDENCY_FINISH,
  UPDATE_DEPENDENCY_START,
  UPDATE_DEPENDENCY_ERROR,
  UPDATE_DEPENDENCY_FINISH,
} from '../actions';

import type { Action } from 'redux';
import type { Dependency } from '../types';

type State = {
  [projectId: string]: {
    [dependencyName: string]: Dependency,
  },
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_DEPENDENCY_INFO_FROM_DISK: {
      const { project, dependencies } = action;

      return {
        ...state,
        [project.id]: dependencies,
      };
    }

    case DELETE_DEPENDENCY_START: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName].status = 'deleting';
      });
    }

    case DELETE_DEPENDENCY_ERROR: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName].status = 'idle';
      });
    }

    case DELETE_DEPENDENCY_FINISH: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        delete draftState[projectId][dependencyName];
      });
    }

    case UPDATE_DEPENDENCY_START: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName].status = 'updating';
      });
    }

    case UPDATE_DEPENDENCY_ERROR: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName].status = 'idle';
      });
    }

    case UPDATE_DEPENDENCY_FINISH: {
      const { projectId, dependencyName, latestVersion } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName].version = latestVersion;
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
export const getDependenciesForProjectId = (
  projectId: string,
  state: any
): Array<Dependency> => {
  const dependenciesForProject = state.dependencies[projectId];

  if (!dependenciesForProject) {
    return [];
  }

  return Object.keys(dependenciesForProject).map(
    dependencyName => dependenciesForProject[dependencyName]
  );
};
