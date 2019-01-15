/* eslint-disable flowtype/require-valid-file-annotation */
import reducer, { initialState } from './app-status.reducer';

import {
  START_DELETING_PROJECT,
  REINSTALL_DEPENDENCIES_START,
  FINISH_DELETING_PROJECT,
  REINSTALL_DEPENDENCIES_FINISH,
  SET_STATUS_TEXT,
  RESET_STATUS_TEXT,
} from '../actions';

describe('App status reducer', () => {
  it('should return initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('Blocking status', () => {
    const blockingStartActions = [
      START_DELETING_PROJECT,
      REINSTALL_DEPENDENCIES_START,
    ];

    const blockingFinishActions = [
      FINISH_DELETING_PROJECT,
      REINSTALL_DEPENDENCIES_FINISH,
    ];

    blockingStartActions.forEach((actionName: string) => {
      it(`should handle start action ${actionName}`, () => {
        const prevState = initialState;

        const action = {
          type: actionName,
        };

        expect(reducer(prevState, action).blockingActionActive).toBeTruthy();
      });
    });

    blockingFinishActions.forEach((actionName: string) => {
      it(`should handle finish action ${actionName}`, () => {
        const prevState = {
          ...initialState,
          blockingActionActive: true,
        };

        const action = { type: actionName };

        expect(reducer(prevState, action).blockingActionActive).toBeFalsy();
      });
    });
  });

  describe('Status text', () => {
    it('should set text', () => {
      const action = {
        type: SET_STATUS_TEXT,
        statusText: 'New message...',
      };
      expect(reducer(initialState, action).statusText).toEqual(
        'New message...'
      );
    });

    it('should reset text to default', () => {
      const action = {
        type: RESET_STATUS_TEXT,
      };
      expect(reducer(initialState, action).statusText).toEqual(
        initialState.statusText
      );
    });
  });
});
