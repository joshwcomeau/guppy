// @flow
import { INITIALIZE, REFRESH_PROJECTS } from '../actions';

// TODO: add a type for Project

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE:
    case REFRESH_PROJECTS: {
      return action.projects;
    }

    default:
      return state;
  }
};
