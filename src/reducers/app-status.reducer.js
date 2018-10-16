// @flow
import { START_DELETING_PROJECT, FINISH_DELETING_PROJECT } from '../actions';

import type { Action } from 'redux';

type State = {
  blockingActionActive: boolean,
};

const initialState = {
  blockingActionActive: false,
};

export default (state: State = initialState, action: Action = {}) => {
  switch (action.type) {
    case START_DELETING_PROJECT:
      return {
        blockingActionActive: true,
      };

    case FINISH_DELETING_PROJECT:
      return {
        blockingActionActive: false,
      };

    default:
      return initialState;
  }
};

//
//
//
// Helpers
export const getBlockingStatus = (state: any) =>
  state.appStatus.blockingActionActive;
