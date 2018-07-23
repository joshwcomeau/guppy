import {
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
} from '../actions';

import type { Action } from 'redux';
import type { Notification } from '../types';

type State = {
  [uniqueNotificationId: string]: Notification,
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
    case UPDATE_NOTIFICATION:
      const existing = state[action.notificationId] || {};
      return {
        ...state,
        [action.notificationId]: {
          title: action.title || existing.title,
          message: action.message || existing.message,
          progress: action.progress || existing.progress,
          complete: action.complete || existing.complete,
        },
      };

    case DELETE_NOTIFICATION:
      const filteredState = { ...state };
      delete filteredState[action.notificationId];
      return filteredState;

    default:
      return state;
  }
};
