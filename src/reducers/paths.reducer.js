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
import produce from 'immer';

import {
  ADD_PROJECT,
  IMPORT_EXISTING_PROJECT_FINISH,
  FINISH_DELETING_PROJECT,
  SAVE_PROJECT_SETTINGS_FINISH,
  RESET_ALL_STATE,
} from '../actions';
import { getProjectNameSlug } from '../services/create-project.service';

import type { Action } from '../actions/types';

type State = {
  byId: {
    [projectId: string]: string,
  },
};

export const initialState = {
  homePath: '',
  byId: {},
};

export default (state: State = initialState, action: Action = {}) => {
  switch (action.type) {
    case ADD_PROJECT: {
      const { project } = action;
      const defaultProjectPath = action.projectHomePath;
      const projectNameSlug = getProjectNameSlug(project.guppy.name);

      return produce(state, draftState => {
        draftState.byId[project.guppy.id] = formatProjectPath(
          defaultProjectPath,
          projectNameSlug
        );
      });
    }

    case IMPORT_EXISTING_PROJECT_FINISH: {
      const { project, projectPath } = action;

      return produce(state, draftState => {
        draftState.byId[project.guppy.id] = projectPath;
      });
    }

    case SAVE_PROJECT_SETTINGS_FINISH: {
      const { project, projectPath } = action;

      return produce(state, draftState => {
        draftState.byId[project.guppy.id] = projectPath;
      });
    }

    case FINISH_DELETING_PROJECT: {
      const { projectId } = action;

      return produce(state, draftState => {
        delete draftState.byId[projectId];
      });
    }

    case RESET_ALL_STATE:
      return initialState;

    default:
      return state;
  }
};

//
//
//
// Helpers
const formatProjectPath = (homePath, projectId) =>
  path.join(homePath, projectId);
//
//
//
// Selectors
export const getPaths = (state: any) => state.paths.byId;
export const getPathsArray = (state: any) => Object.values(getPaths(state));

export const getPathForProjectId = (state: any, props: { projectId: string }) =>
  state.paths.byId[props.projectId];
