// @flow
import { LOAD_DEPENDENCY_INFO_FROM_DISK } from '../actions';

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

    default:
      return state;
  }
};

//
//
//
// Selectors
type GlobalState = { dependencies: State };

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
