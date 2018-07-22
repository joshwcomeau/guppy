// @flow
/**
 * By default, all Guppy projects are stored in ~/guppy-projects.
 * Users can import pre-existing projects from other paths, though.
 * This reducer holds a mapping of project names to their on-disk locations.
 *
 * It's kept separate from the `projects` reducer because that reducer maps
 * very closely to the project's package.json, and we don't want project path
 * to be tied to a specific project (the same project might exist at different
 * paths on different computers!).
 */
import { ADD_PROJECT, IMPORT_EXISTING_PROJECT_FINISH } from '../actions';

import type { Action } from 'redux';

const os = window.require('os');

type State = {
  [projectId: string]: string,
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      const { path, project } = action;

      return {
        ...state,
        [project.guppy.id]: path || getDefaultPath(project.guppy.id),
      };
    }

    default:
      return state;
  }
};

//
//
//
// Helpers
export const getDefaultParentPath = () =>
  // Noticing some weird quirks when I try to use a dev project on the compiled
  // "production" app, so separating their home paths should help.
  process.env.NODE_ENV === 'development'
    ? `${os.homedir()}/guppy-projects-dev`
    : `${os.homedir()}/guppy-projects`;

export const getDefaultPath = (projectId: string) =>
  `${getDefaultParentPath()}/${projectId}`;

//
//
//
// Selectors
export const getPathForProjectId = (state: any, projectId: string) =>
  state.paths[projectId] || getDefaultPath(projectId);
