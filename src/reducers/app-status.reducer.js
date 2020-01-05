// @flow
import {
  START_DELETING_PROJECT,
  FINISH_DELETING_PROJECT,
  DELETE_PROJECT_ERROR,
  REINSTALL_DEPENDENCIES_START,
  REINSTALL_DEPENDENCIES_FINISH,
  SET_STATUS_TEXT,
  RESET_STATUS_TEXT,
  SET_ONLINE_STATUS,
  SET_INFO_BAR_STRING,
  SET_INCORRECT_NODE,
} from '../actions';

import type { Action } from '../actions/types';

type State = {
  blockingActionActive: boolean,
  statusText: string,
  onlineStatus: boolean,
  infoBarString: ?String,
};

export const initialState = {
  blockingActionActive: false,
  statusText: 'Please wait...',
  onlineStatus: navigator.onLine,
  infoBarString: null,
  incorrectNode: false,
};

export default (state: State = initialState, action: Action = {}) => {
  switch (action.type) {
    case START_DELETING_PROJECT:
    case REINSTALL_DEPENDENCIES_START:
      return {
        ...state,
        blockingActionActive: true,
      };

    case FINISH_DELETING_PROJECT:
    case DELETE_PROJECT_ERROR:
    case REINSTALL_DEPENDENCIES_FINISH:
      return {
        ...state,
        blockingActionActive: false,
      };

    case SET_STATUS_TEXT:
      const newStatus = action.statusText;
      if (!newStatus) {
        return state;
      }

      return {
        ...state,
        statusText: newStatus,
      };

    case RESET_STATUS_TEXT:
      return {
        ...state,
        statusText: initialState.statusText,
      };

    case SET_ONLINE_STATUS:
      return {
        ...state,
        onlineStatus: action.onlineStatus,
      };

    case SET_INFO_BAR_STRING:
      return {
        ...state,
        infoBarString: action.infoBarString,
      };

    case SET_INCORRECT_NODE:
      return {
        ...state,
        incorrectNode: action.incorrectNode,
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

export const getStatusText = (state: any) => state.appStatus.statusText;

export const getReinstallingActive = (state: any) =>
  state.appStatus.reinstallingActive;

export const getOnlineState = (state: any) => state.appStatus.onlineStatus;

export const getInfoBarState = (state: any) => state.appStatus.infoBarString;

export const getIncorrectNodeState = (state: any) =>
  state.appStatus.incorrectNode;
