/* eslint-disable flowtype/require-valid-file-annotation */
import reducer, { initialState } from './modal.reducer';
import {
  CREATE_NEW_PROJECT_START,
  CREATE_NEW_PROJECT_CANCEL,
  CREATE_NEW_PROJECT_FINISH,
  IMPORT_EXISTING_PROJECT_START,
  SAVE_PROJECT_SETTINGS_FINISH,
  SHOW_PROJECT_SETTINGS,
  SHOW_APP_SETTINGS,
  HIDE_MODAL,
  RESET_ALL_STATE,
} from '../actions';

describe('Modal reducer', () => {
  it('should return initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  const modalShowActions = [
    { actionType: CREATE_NEW_PROJECT_START, expected: 'new-project-wizard' },
    { actionType: SHOW_PROJECT_SETTINGS, expected: 'project-settings' },
    { actionType: SHOW_APP_SETTINGS, expected: 'app-settings' },
  ];

  const modalCloseActions = [
    CREATE_NEW_PROJECT_CANCEL,
    CREATE_NEW_PROJECT_FINISH,
    IMPORT_EXISTING_PROJECT_START,
    SAVE_PROJECT_SETTINGS_FINISH,
    HIDE_MODAL,
  ];

  modalShowActions.forEach(action => {
    it(`should handle ${action.actionType}`, () => {
      const newState = reducer(initialState, { type: action.actionType });
      expect(newState).toEqual(action.expected);
    });
  });

  modalCloseActions.forEach(action => {
    const prevState = 'new-project-wizard';

    it(`should close modal with action ${action}`, () => {
      expect(reducer(prevState, { type: action })).toEqual(null);
    });
  });

  it(`should reset state on ${RESET_ALL_STATE}`, () => {
    const prevState = 'new-project-wizard';
    expect(reducer(prevState, { type: RESET_ALL_STATE })).toEqual(null);
  });
});
