// @flow
/**
 * There is a certain amount of initialization that needs to happen before
 * it makes sense to show anything to the user.
 *
 * Specifically:
 *
 * - We need to load persisted redux state, to know if the user is onboarding,
 *   what their projects are, etc.
 * - We want to parse the projects on disk to get up-to-date info, because
 *   the persisted redux state is incomplete; doesn't have info about tasks.
 *
 * This simple boolean reducer defaults to `false` and is toggled to `true`
 * once enough state has been loaded for us to show the user some UI.
 */

import { REFRESH_PROJECTS_FINISH } from '../actions';

import type { Action } from 'redux';

type State = boolean;

const initialState = false;

export default (state: State = initialState, action: Action = {}) => {
  switch (action.type) {
    case REFRESH_PROJECTS_FINISH:
      return true;

    default:
      return state;
  }
};

//
//
//
// Selectors
export const getAppLoaded = (state: any) => state.appLoaded;
