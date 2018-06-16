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
import { IMPORT_EXISTING_PROJECT_FINISH } from '../actions';

import type { Action } from 'redux';

const os = window.require('os');

type State = {
  [projectId: string]: string,
};

// By default, all projects live in ~/guppy-projects
// At some point maybe I should make this configurable... for now, individual
// projects can be imported from other places, but all projects created with
// Guppy live here.
const DEFAULT_PARENT_PATH = `${os.homedir()}/guppy-projects`;

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case IMPORT_EXISTING_PROJECT_FINISH: {
      const { path, project } = action;

      return {
        ...state,
        [project.guppy.id]: path,
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
export const getPathForProjectId = (projectId: string, state: any) =>
  state.paths[projectId] || `${DEFAULT_PARENT_PATH}/${projectId}`;
