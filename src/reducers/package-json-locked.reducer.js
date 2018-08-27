// @flow
/**
 * Unlike a terminal, Guppy isn't locked up when performing actions like
 * installing or updating dependencies.
 *
 * This presents a problem, though; if the user quickly tries to update multiple
 * dependencies, there's a good chance that all but the first will fail. This
 * is because the first process writes to the package.json, and locks that file.
 * When the second dependency update tries to write to the file, it throws an
 * error.
 *
 * Eventually, it would be good to build a queue system, to abstract this away
 * from the user, so that they can just do whatever they want and we'll smartly
 * group actions when possible, and sequence them when not.
 *
 * For now, though, we'll just lock package-json-type actions while something
 * is in progress. And to track that, we have this simple reducer.
 *
 * Every project has its own package.json, and they shouldn't block each other.
 * So this is on a per-project basis.
 */
import {
  REFRESH_PROJECTS_FINISH,
  ADD_PROJECT,
  ADD_DEPENDENCY_START,
  ADD_DEPENDENCY_ERROR,
  ADD_DEPENDENCY_FINISH,
  UPDATE_DEPENDENCY_START,
  UPDATE_DEPENDENCY_ERROR,
  UPDATE_DEPENDENCY_FINISH,
  DELETE_DEPENDENCY_START,
  DELETE_DEPENDENCY_ERROR,
  DELETE_DEPENDENCY_FINISH,
} from '../actions';

import type { Action } from 'redux';

type State = {
  [projectId: string]: boolean,
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case REFRESH_PROJECTS_FINISH:
      return Object.keys(action.projects).reduce(
        (acc, projectId) => ({
          ...acc,
          [projectId]: false,
        }),
        {}
      );

    case ADD_PROJECT:
      return {
        ...state,
        [action.project.id]: false,
      };

    case ADD_DEPENDENCY_START:
    case UPDATE_DEPENDENCY_START:
    case DELETE_DEPENDENCY_START:
      return {
        ...state,
        [action.projectId]: true,
      };

    case ADD_DEPENDENCY_ERROR:
    case ADD_DEPENDENCY_FINISH:
    case UPDATE_DEPENDENCY_ERROR:
    case UPDATE_DEPENDENCY_FINISH:
    case DELETE_DEPENDENCY_ERROR:
    case DELETE_DEPENDENCY_FINISH:
      return {
        ...state,
        [action.projectId]: false,
      };

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
) => state.packageJsonLocked[projectId];
