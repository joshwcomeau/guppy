// @flow
import { produce } from 'immer';
import { READ_PROJECTS_FROM_DISK } from '../actions';

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
    case READ_PROJECTS_FROM_DISK: {
      return action.projects;
    }

    default:
      return state;
  }
};
