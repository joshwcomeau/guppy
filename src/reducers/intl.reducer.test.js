/* eslint-disable flowtype/require-valid-file-annotation */
import reducer, { initialState } from './intl.reducer';
import { CHANGE_LANGUAGE, RESET_ALL_STATE } from '../actions';

describe('Intl reducer', () => {
  it('should return initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  it('should change language setting to Chinese', () => {
    const prevState = initialState;

    const action = {
      type: CHANGE_LANGUAGE,
      language: 'zh',
    };

    expect(reducer(prevState, action)).toMatchObject({
      locale: 'zh',
      messages: {
        'introScreen.actions.create': '创建一个新的网页应用',
      },
    });
  });

  it('should change language setting to English', () => {
    const prevState = initialState;

    const action = {
      type: CHANGE_LANGUAGE,
      language: 'en',
    };

    expect(reducer(prevState, action)).toMatchObject({
      locale: 'en',
      messages: {
        'introScreen.actions.create': 'Create a new web application',
      },
    });
  });

  it('should restore the original state', () => {
    const prevState = {
      ...initialState,
      locale: 'zh',
    };

    prevState['messages']['introScreen.actions.create'] =
      '创建一个新的网页应用';

    const action = { type: RESET_ALL_STATE };

    expect(reducer(prevState, action)).toEqual(initialState);
  });
});
