// @flow
import { combineReducers } from 'redux';
import { ADD_PROJECT, REFRESH_PROJECTS, SELECT_PROJECT } from '../actions';

import type { Action } from 'redux';
import type { Project } from '../types';

type ById = {
  [key: string]: Project,
};
type SelectedId = ?string;

type State = {
  byId: ById,
  selectedId: SelectedId,
};

const initialState = {
  byId: {},
  selectedId: null,
};

const byId = (state: ById = initialState.byId, action: Action) => {
  switch (action.type) {
    case REFRESH_PROJECTS: {
      return action.projects;
    }

    case ADD_PROJECT: {
      return {
        ...state,
        [action.project.guppy.id]: action.project,
      };
    }

    default:
      return state;
  }
};

const selectedId = (
  state: SelectedId = initialState.selectedId,
  action: Action
) => {
  switch (action.type) {
    case ADD_PROJECT: {
      return action.project.guppy.id;
    }

    case SELECT_PROJECT: {
      return action.projectId;
    }

    default:
      return state;
  }
};

export default combineReducers({ byId, selectedId });

//
//
//
// Selectors
type GlobalState = { projects: State };

export const getProjectsArray = (state: GlobalState) =>
  Object.values(state.projects.byId);

export const getSelectedProjectId = (state: GlobalState) =>
  state.projects.selectedId;

export const getSelectedProject = (state: GlobalState) =>
  state.projects.selectedId
    ? state.projects.byId[state.projects.selectedId]
    : null;
