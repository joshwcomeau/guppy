// @flow
import {
  START_CREATING_NEW_PROJECT,
  CANCEL_CREATING_NEW_PROJECT,
  DISMISS_SIDEBAR_INTRO,
  ADD_PROJECT,
} from '../actions';

import type { Action } from '../types';

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
    case START_CREATING_NEW_PROJECT: {
      if (state === 'brand-new') {
        return 'creating-first-project';
      }
    }

    case CANCEL_CREATING_NEW_PROJECT: {
      if (state === 'creating-first-project') {
        return 'brand-new';
      }
    }

    case ADD_PROJECT: {
      if (state === 'creating-first-project') {
        return 'introducing-sidebar';
      }
    }

    case DISMISS_SIDEBAR_INTRO: {
      if (state === 'introducing-sidebar') {
        return 'done';
      }
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
