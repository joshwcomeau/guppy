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
  ADD_DEPENDENCY_START,
  ADD_DEPENDENCY_ERROR,
  ADD_DEPENDENCY_FINISH,
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
      const { projectId, dependencies } = action;

      return {
        ...state,
        [projectId]: dependencies,
      };
    }

    case ADD_DEPENDENCY_START: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName] = {
          name: dependencyName,
          status: 'installing',
          // All of the other fields are unknown at this point.
          // To make life simpler, we'll set them to empty strings,
          // rather than deal with nullable fields everywhere else.
          description: '',
          version: '',
          homepage: '',
          license: '',
          repository: '',
        };
      });
    }

    case ADD_DEPENDENCY_ERROR: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        // If the dependency couldn't be installed, we should remove it from
        // state.
        delete draftState[projectId][dependencyName];
      });
    }

    case ADD_DEPENDENCY_FINISH: {
      const { projectId, dependency } = action;

      return produce(state, draftState => {
        draftState[projectId][dependency.name] = dependency;
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

  return Object.keys(dependenciesForProject)
    .sort()
    .map(dependencyName => dependenciesForProject[dependencyName]);
};
