// @flow
import {
  CREATE_NEW_PROJECT_START,
  CREATE_NEW_PROJECT_CANCEL,
  DISMISS_SIDEBAR_INTRO,
  ADD_PROJECT,
  IMPORT_EXISTING_PROJECT_START,
  IMPORT_EXISTING_PROJECT_ERROR,
  IMPORT_EXISTING_PROJECT_FINISH,
  SELECT_PROJECT,
} from '../actions';

import type { Action } from 'redux';

export type State =
  | 'brand-new'
  | 'creating-first-project'
  | 'introducing-sidebar'
  | 'done';

// TODO: Pull this from localStorage
const initialState = 'brand-new';

export default (state: State = initialState, action: Action) => {
  if (state === 'done') {
    return state;
  }

  switch (action.type) {
    case CREATE_NEW_PROJECT_START:
    case IMPORT_EXISTING_PROJECT_START: {
      return state === 'brand-new' ? 'creating-first-project' : state;
    }

    case IMPORT_EXISTING_PROJECT_ERROR:
    case CREATE_NEW_PROJECT_CANCEL: {
      return state === 'creating-first-project' ? 'brand-new' : state;
    }

    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      return state === 'creating-first-project' ? 'introducing-sidebar' : state;
    }

    case DISMISS_SIDEBAR_INTRO:
    case SELECT_PROJECT: {
      return state === 'introducing-sidebar' ? 'done' : state;
    }

    default:
      return state;
  }
};

type GlobalState = { onboardingStatus: State };

export const getOnboardingStatus = (state: GlobalState) =>
  state.onboardingStatus;

export const getSidebarVisibility = (state: GlobalState) =>
  state.onboardingStatus === 'introducing-sidebar' ||
  state.onboardingStatus === 'done';
