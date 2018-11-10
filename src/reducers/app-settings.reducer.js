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

import {
  SAVE_APP_SETTINGS_START,
  CHANGE_DEFAULT_PROJECT_PATH,
} from '../actions';
import produce from 'immer';
import * as os from 'os';
import * as path from 'path';

import { windowsHomeDir, isWin } from '../services/platform.service';

import type { Action } from 'redux';
import type { AppSettings } from '../types';

// Noticing some weird quirks when I try to use a dev project on the compiled
// "production" app, so separating their home paths should help.
const homedir = isWin ? windowsHomeDir : os.homedir();

export const initialState: AppSettings = {
  general: {
    defaultProjectPath:
      process.env.NODE_ENV === 'development'
        ? path.join(homedir, 'guppy-projects-dev')
        : path.join(homedir, 'guppy-projects'),
    defaultProjectType: 'create-react-app',
  },
  privacy: {
    enableUsageTracking: true,
  },
};

export default (state: AppSettings = initialState, action: Action = {}) => {
  switch (action.type) {
    case SAVE_APP_SETTINGS_START:
      return {
        ...action.settings,
      };

    case CHANGE_DEFAULT_PROJECT_PATH:
      return produce(state, draftState => {
        draftState.general.defaultProjectPath = action.defaultProjectPath;
      });

    default:
      return state;
  }
};

//
//
//
// Selectors
export const getAppSettings = (state: any) => state.appSettings;
export const getDefaultProjectPath = (state: any) =>
  state.appSettings.general.defaultProjectPath;

export const getDefaultProjectType = (state: any) =>
  state.appSettings.general.defaultProjectType;

export const getPrivacySettings = (state: any) => state.appSettings.privacy;
