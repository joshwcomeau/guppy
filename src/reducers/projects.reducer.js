// @flow
import { combineReducers } from 'redux';
import produce from 'immer';

import {
  ADD_PROJECT,
  IMPORT_EXISTING_PROJECT_FINISH,
  FINISH_DELETING_PROJECT,
  INSTALL_DEPENDENCIES_FINISH,
  REFRESH_PROJECTS_FINISH,
  SELECT_PROJECT,
  RESET_ALL_STATE,
} from '../actions';
import { getTasksForProjectId } from './tasks.reducer';
import { getDependenciesForProjectId } from './dependencies.reducer';
import { getPathForProjectId } from './paths.reducer';

import type { Action } from 'redux';
import type { ProjectInternal, Project } from '../types';

type ById = {
  [key: string]: ProjectInternal,
};

type SelectedId = ?string;

type State = {
  byId: ById,
  selectedId: SelectedId,
};

export const initialState = {
  byId: {},
  selectedId: null,
};

const byIdReducer = (state: ById = initialState.byId, action: Action) => {
  switch (action.type) {
    case REFRESH_PROJECTS_FINISH: {
      return action.projects;
    }

    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      return {
        ...state,
        [action.project.guppy.id]: action.project,
      };
    }

    case INSTALL_DEPENDENCIES_FINISH: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          draftState[projectId].dependencies[dependency.name] =
            dependency.version;
        });
      });
    }

    case FINISH_DELETING_PROJECT: {
      const { projectId } = action;

      return produce(state, draftState => {
        delete draftState[projectId];
      });
    }

    case RESET_ALL_STATE:
      return initialState.byId;

    default:
      return state;
  }
};

const selectedIdReducer = (
  state: SelectedId = initialState.selectedId,
  action: Action
) => {
  switch (action.type) {
    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      // When a new project is created/imported, we generally want to select
      // it! The only exception is during onboarding. We want the user to
      // manually click the icon, to teach them what these icons are.
      //
      // NOTE: This is knowable because after onboarding, a project will
      // _always_ be selected. This is a fundamental truth about how Guppy
      // works. In the future, though, we may want to have non-project screens,
      // and so this will have to be rethought.
      return state ? action.project.guppy.id : null;
    }

    case REFRESH_PROJECTS_FINISH: {
      // It's possible that the selected project no longer exists (say if the
      // user deletes that folder and then refreshes Guppy).
      // In that case, un-select it.
      const selectedProjectId = state;

      if (!selectedProjectId) {
        return state;
      }

      const selectedProjectExists = !!action.projects[selectedProjectId];

      return selectedProjectExists ? state : null;
    }

    case SELECT_PROJECT: {
      return action.projectId;
    }

    case RESET_ALL_STATE:
      return initialState.selectedId;

    default:
      return state;
  }
};

export default combineReducers({
  byId: byIdReducer,
  selectedId: selectedIdReducer,
});

//
//
//
// Selectors
type GlobalState = { projects: State };

// Our projects in-reducer are essentially database items that represent the
// package.json on disk.
//
// For using within the app, though, we can do a few things to make it nicer
// to work with:
//
//  - Combine it with the tasks in `tasks.reducer`, since this is much more
//    useful than project.scripts
//  - Solve the ugliness with `project.guppy.X`
const prepareProjectForConsumption = (
  state: GlobalState,
  project: ProjectInternal
): Project => {
  return {
    id: project.guppy.id,
    name: project.guppy.name,
    type: project.guppy.type,
    color: project.guppy.color,
    icon: project.guppy.icon,
    createdAt: project.guppy.createdAt,
    tasks: getTasksForProjectId(state, project.guppy.id),
    dependencies: getDependenciesForProjectId(state, project.guppy.id),
    path: getPathForProjectId(state, project.guppy.id),
  };
};

export const getById = (state: GlobalState) => state.projects.byId;
export const getSelectedProjectId = (state: GlobalState) =>
  state.projects.selectedId;

export const getInternalProjectById = (state: GlobalState, id: string) =>
  getById(state)[id];

export const getProjectsArray = (state: GlobalState) => {
  // $FlowFixMe
  return Object.values(state.projects.byId)
    .map(project =>
      // $FlowFixMe
      prepareProjectForConsumption(state, project)
    )
    .sort((p1, p2) => (p1.createdAt < p2.createdAt ? 1 : -1));
};

export const getProjectById = (state: GlobalState, id: string) =>
  prepareProjectForConsumption(state, state.projects.byId[id]);

// TODO: check the perf cost of this selector, memoize if it's non-trivial.
export const getSelectedProject = (state: GlobalState) => {
  const selectedId = getSelectedProjectId(state);

  if (!selectedId) {
    return null;
  }

  const project = state.projects.byId[selectedId];

  if (!project) {
    return null;
  }

  return prepareProjectForConsumption(state, project);
};

export const getDependencyMapForSelectedProject = (state: GlobalState) => {
  const projectId = getSelectedProjectId(state);

  if (!projectId) {
    return [];
  }

  const dependencies = getDependenciesForProjectId(state, projectId);

  return dependencies.reduce((acc, dep) => {
    acc[dep.name] = dep;
    return acc;
  }, {});
};
