// @flow
import { combineReducers } from 'redux';
import { ADD_PROJECT, REFRESH_PROJECTS } from '../actions';

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
        [action.project.name]: action.project,
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
      return action.project.name;
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

export const getSelectedProject = (state: GlobalState) =>
  state.projects.selectedId
    ? state.projects.byId[state.projects.selectedId]
    : null;
