// @flow
import { CHANGE_LANGUAGE, RESET_ALL_STATE } from '../actions';
import produce from 'immer';

import type { Action } from 'redux';
import { USE_NAVIGATOR_LANGUAGE } from '../config/app';

import IntroScreenEn from '../locale/en/IntroScreen.json';
import IntroScreenZh from '../locale/zh/IntroScreen.json';

const messages = {
  en: {
    ...IntroScreenEn,
  },
  zh: {
    ...IntroScreenZh,
  },
};

const initialLocale = USE_NAVIGATOR_LANGUAGE
  ? window.navigator.language.slice(0, 2)
  : 'en';

type State = {
  locale: string,
  messages: {
    [messageId: string]: string,
  },
};

export const initialState = {
  locale: initialLocale,
  messages: messages[initialLocale] || messages['en'],
};

export default (state: State = initialState, action: Action = {}) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return produce(state, draftState => {
        draftState.locale = action.language;
        draftState.messages = messages[action.language] || messages['en'];
      });

    case RESET_ALL_STATE:
      return initialState;

    default:
      return state;
  }
};

//
//
//
// Selectors
export const getLanguage = (state: any) => state.intl.locale;
