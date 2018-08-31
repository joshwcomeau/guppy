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
  REFRESH_PROJECTS_FINISH,
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

    case REFRESH_PROJECTS_FINISH: {
      // In earlier versions of the app, we would automatically parse the
      // Guppy project directory for projects.
      //
      // If the user clears their electron store, this could lead to a state
      // where their onboarding status is reset, but projects exist. This ought
      // to be an impossible state: if the user has projects, they're done with
      // onboarding!
      //
      // Now that we've solved the state-persistence issue and are no longer
      // scanning directories for projects, this shouldn't be an issue anymore.
      // This change is for older clients, and can safely be removed in
      // winter 2018.
      const projectKeys = Object.keys(action.projects);

      return projectKeys.length > 0 ? 'done' : state;
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
