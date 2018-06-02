// @flow
import {
  START_CREATING_NEW_PROJECT,
  CANCEL_CREATING_NEW_PROJECT,
  FINISH_CREATING_NEW_PROJECT,
} from '../actions';

import type { Action } from 'redux';

type State = 'new-project-wizard' | null;

const initialState = null;

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case START_CREATING_NEW_PROJECT:
      return 'new-project-wizard';

    case CANCEL_CREATING_NEW_PROJECT:
    case FINISH_CREATING_NEW_PROJECT:
      return null;

    default:
      return state;
  }
};
