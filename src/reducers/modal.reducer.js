// @flow
/**
 * NOTE: Not all modals use this reducer.
 * Clicking a task details button just uses local state.
 * Unclear to me if it makes sense to keep this in Redux or not.
 */
import {
  CREATE_NEW_PROJECT_START,
  CREATE_NEW_PROJECT_CANCEL,
  CREATE_NEW_PROJECT_FINISH,
  IMPORT_EXISTING_PROJECT_START,
  SAVE_PROJECT_SETTINGS_FINISH,
  SHOW_PROJECT_SETTINGS,
  HIDE_MODAL,
  RESET_ALL_STATE,
} from '../actions';

import type { Action } from 'redux';

type State = 'new-project-wizard' | 'project-settings' | null;

const initialState = null;

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case CREATE_NEW_PROJECT_START:
      return 'new-project-wizard';

    case SHOW_PROJECT_SETTINGS:
      return 'project-settings';

    case CREATE_NEW_PROJECT_CANCEL:
    case CREATE_NEW_PROJECT_FINISH:
    case IMPORT_EXISTING_PROJECT_START:
    case SAVE_PROJECT_SETTINGS_FINISH:
    case HIDE_MODAL:
      return null;

    case RESET_ALL_STATE:
      return initialState;

    default:
      return state;
  }
};
