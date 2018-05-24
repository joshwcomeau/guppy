// @flow
import { produce } from 'immer';
import { INITIALIZE, REFRESH_PROJECTS } from '../actions';

type Project = {
  id: string,
  name: string,
  type: 'react',
  status: 'creating' | 'idle' | 'installing-dependency',
  statusMetadata: ?string,
};

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
