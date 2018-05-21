// @flow
import immer from 'immer';
import { CREATE_PROJECT_START } from '../actions';

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
    case CREATE_PROJECT_START: {
      const { id, name, type } = action;
      // TODO: While the component firing the action should verify that
      // we aren't "overwriting" an existing project, we should add a
      // layer of redundancy here, and just throw an error if there's
      // an overwrite attempt.

      return produce(state, draftState => {
        draftState[id] = {
          id,
          name,
          type,
          status: 'creating',
        };
      });
    }

    case CREATE_PROJECT_UPDATE_STATUS: {
      const { id, metadata } = action;

      return produce(state, draftState => {
        draftState[id].statusMetadata = metadata;
      });
    }

    case CREATE_PROJECT_FINISH: {
    }

    default:
      return state;
  }
};
