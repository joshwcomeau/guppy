// @flow
import { INITIALIZE, REFRESH_PROJECTS } from '../actions';

import type { Project } from '../types';

type State = {
  projects: Array<Project>,
};

type Action = {
  type: string,
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

    default:
      return state;
  }
};

export const getNumberOfProjects = (state: State) =>
  // $FlowFixMe
  Object.keys(state.projects).length;
