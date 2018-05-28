// @flow
import {
  START_CREATING_NEW_PROJECT,
  ADD_PROJECT,
  HIDE_MODAL,
} from '../actions';

import type { Action } from '../types';

type State = 'new-project-wizard' | null;

const initialState = null;

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case START_CREATING_NEW_PROJECT:
      return 'new-project-wizard';

    case ADD_PROJECT:
    case HIDE_MODAL:
      return null;

    default:
      return state;
  }
};
