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

const initialState = {
  abc123: {
    title: 'Notification title',
    message: 'Notification message content',
    progress: 0.5,
  },
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
    case UPDATE_NOTIFICATION:
      return {
        ...state,
        [action.notificationId]: {
          title: action.title,
          message: action.message,
          progress: action.progress,
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
