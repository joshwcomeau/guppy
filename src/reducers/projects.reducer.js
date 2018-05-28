// @flow
import { INITIALIZE, ADD_PROJECT, REFRESH_PROJECTS } from '../actions';

import type { Project, Action } from '../types';

type State = {
  projects: Array<Project>,
};

const initialState = {
  projects: [],
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case INITIALIZE:
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

export const getNumberOfProjects = (state: State) =>
  // $FlowFixMe
  Object.keys(state.projects).length;
