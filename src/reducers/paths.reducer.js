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
import * as path from 'path';
import * as os from 'os';
import { ADD_PROJECT, IMPORT_EXISTING_PROJECT_FINISH } from '../actions';
import { windowsHomeDir, isWin } from '../services/platform.service';

import type { Action } from 'redux';

type State = {
  [projectId: string]: string,
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      const { projectPath, project } = action;

      return {
        ...state,
        [project.guppy.id]: projectPath || getDefaultPath(project.guppy.id),
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
const homedir = isWin ? windowsHomeDir : os.homedir();
// Noticing some weird quirks when I try to use a dev project on the compiled
// "production" app, so separating their home paths should help.
export const defaultParentPath =
  process.env.NODE_ENV === 'development'
    ? path.join(homedir, '/guppy-projects-dev')
    : path.join(homedir, '/guppy-projects');

export const getDefaultPath = (projectId: string) =>
  `${defaultParentPath}/${projectId}`;

//
//
//
// Selectors
export const getPathsArray = (state: any) => Object.values(state.paths);
export const getPathForProjectId = (state: any, projectId: string) =>
  state.paths[projectId] || getDefaultPath(projectId);
