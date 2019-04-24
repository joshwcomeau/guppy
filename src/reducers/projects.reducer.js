// @flow
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import produce from 'immer';

import {
  ADD_PROJECT,
  IMPORT_EXISTING_PROJECT_FINISH,
  FINISH_DELETING_PROJECT,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_FINISH,
  REFRESH_PROJECTS_FINISH,
  SAVE_PROJECT_SETTINGS_FINISH,
  SELECT_PROJECT,
  RESET_ALL_STATE,
  REARRANGE_PROJECTS_IN_SIDEBAR,
} from '../actions';
import { getTasks, getTasksForProjectId } from './tasks.reducer';
import {
  getDependencies,
  getDependenciesForProjectId,
} from './dependencies.reducer';
import { getPaths, getPathForProjectId } from './paths.reducer';

import type { Action } from '../actions/types';
import type { ProjectInternal, Project, Task, Dependency } from '../types';

type ById = {
  [key: string]: ProjectInternal,
};

type SelectedId = ?string;

type State = {
  byId: ById,
  selectedId: SelectedId,
  order: Array<string>,
};

export const initialState = {
  byId: {},
  selectedId: null,
  order: [],
};

const byIdReducer = (state: ById = initialState.byId, action: Action = {}) => {
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

    case UNINSTALL_DEPENDENCIES_FINISH: {
      const { projectId, dependencies } = action;
      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          delete draftState[projectId].dependencies[dependency.name];
        });
      });
    }

    case FINISH_DELETING_PROJECT: {
      const { projectId } = action;

      return produce(state, draftState => {
        delete draftState[projectId];
      });
    }

    case SAVE_PROJECT_SETTINGS_FINISH: {
      const { project } = action;
      const {
        guppy: { id },
      } = project;

      return produce(state, draftState => {
        draftState[id] = project;
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
  action: Action = {}
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
      return action.isOnboardingCompleted ? action.project.guppy.id : null;
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

    case SAVE_PROJECT_SETTINGS_FINISH: {
      return action.project.guppy.id;
    }

    case SELECT_PROJECT: {
      return action.projectId;
    }

    case FINISH_DELETING_PROJECT: {
      // Right now, it is only possible to delete the currently-selected
      // project, so this condition will always be true. This is a guard against
      // future changes.
      const justDeletedSelectedProject = action.projectId === state;

      return justDeletedSelectedProject ? null : state;
    }

    case RESET_ALL_STATE: {
      return initialState.selectedId;
    }

    default:
      return state;
  }
};

const orderReducer = (state = initialState.order, action: Action = {}) => {
  switch (action.type) {
    case REFRESH_PROJECTS_FINISH: {
      // It is possible that projects changed so we have to update but maintain the order
      const previousOrder = state;
      const projectsArray = Object.keys(action.projects);

      return projectsArray.sort(
        (p1, p2) =>
          previousOrder.indexOf(p1) > previousOrder.indexOf(p2) ? 1 : -1
      );
    }

    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      return [action.project.guppy.id, ...state];
    }

    case FINISH_DELETING_PROJECT: {
      const { projectId } = action;
      const orderIndex = state.indexOf(projectId);

      return produce(state, draftState => {
        draftState.splice(orderIndex, 1);
      });
    }

    case REARRANGE_PROJECTS_IN_SIDEBAR: {
      const { originalIndex, newIndex } = action;

      return produce(state, draftState => {
        const [removed] = draftState.splice(originalIndex, 1);
        draftState.splice(newIndex, 0, removed);
      });
    }

    case RESET_ALL_STATE:
      return initialState.order;

    default:
      return state;
  }
};

export default combineReducers({
  byId: byIdReducer,
  selectedId: selectedIdReducer,
  order: orderReducer,
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
//  - Combine it with the dependencies in `dependencies.reducer`
//  - Fetch the project's on-disk path from `paths.reducer`
//  - Serve a minimal subset of the `project` fields, avoiding the weirdness
//    with multiple names, and all the raw unnecessary package.json data.
export const prepareProjectForConsumption = (
  project: ProjectInternal,
  tasks: { [key: string]: Task },
  dependencies: { [key: string]: Dependency },
  path: string
): Project => {
  return {
    id: project.guppy.id,
    name: project.guppy.name,
    type: project.guppy.type,
    color: project.guppy.color,
    icon: project.guppy.icon,
    createdAt: project.guppy.createdAt,
    tasks: tasks ? Object.keys(tasks).map(taskId => tasks[taskId]) : [],
    dependencies: dependencies
      ? Object.keys(dependencies).map(
          dependencyId => dependencies[dependencyId]
        )
      : [],
    path,
  };
};

export const getById = (state: GlobalState) => state.projects.byId;
export const getOrder = (state: GlobalState) => state.projects.order;
export const getSelectedProjectId = (state: GlobalState) =>
  state.projects.selectedId;

export const getInternalProjectById = (
  state: GlobalState,
  props: { projectId: string }
) => getById(state)[props.projectId];

export const getProjectsArray = createSelector(
  [getById, getTasks, getDependencies, getPaths, getOrder],
  (byId, tasks, dependencies, paths, order) => {
    return Object.keys(byId)
      .map(projectId => {
        const project = byId[projectId];
        return prepareProjectForConsumption(
          project,
          tasks[projectId],
          dependencies[projectId],
          paths[projectId]
        );
      })
      .sort((p1, p2) => (order.indexOf(p1.id) > order.indexOf(p2.id) ? 1 : -1));
  }
);

export const getProjectById = createSelector(
  [
    getInternalProjectById,
    getTasksForProjectId,
    getDependenciesForProjectId,
    getPathForProjectId,
  ],
  (internalProject, tasks, dependencies, path) => {
    if (!internalProject) {
      return null;
    }

    return prepareProjectForConsumption(
      internalProject,
      tasks,
      dependencies,
      path
    );
  }
);

export const getSelectedProject = (state: GlobalState) => {
  const selectedId = getSelectedProjectId(state);

  if (!selectedId) {
    return null;
  }

  return getProjectById(state, { projectId: selectedId });
};

export const getDependencyMapForSelectedProject = (state: GlobalState) => {
  const projectId = getSelectedProjectId(state);

  if (!projectId) {
    return [];
  }

  return getDependenciesForProjectId(state, { projectId });
};
