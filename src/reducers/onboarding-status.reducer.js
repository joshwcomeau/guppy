// @flow
import {
  DISMISS_SIDEBAR_INTRO,
  ADD_PROJECT,
  REFRESH_PROJECTS,
} from '../actions';

import type { Action } from 'redux';

export type State =
  | 'brand-new'
  | 'introducing-sidebar'
  | 'done';

// TODO: Pull this from localStorage
const initialState = 'brand-new';

export default (state: State = initialState, action: Action) => {
  if (state === 'done') {
    return state;
  }

  switch (action.type) {
    case ADD_PROJECT: {
      return state === 'brand-new' ? 'introducing-sidebar' : state;
    }

    case DISMISS_SIDEBAR_INTRO: {
      return state === 'introducing-sidebar' ? 'done' : state;
    }

    case REFRESH_PROJECTS: {
      // If the disk reveals that this user already has guppy projects, we
      // should assume that the onboarding has been completed previously.
      // This can happen when Guppy has to rebuild the local storage from
      // disk (which might happen after the app updates?)
      if (Object.keys(action.projects).length) {
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
