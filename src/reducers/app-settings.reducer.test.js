/* eslint-disable flowtype/require-valid-file-annotation */
import reducer, {
  initialState,
  getDefaultProjectPath,
  getDefaultProjectType,
  getPrivacySettings,
  getAppSettings,
} from './app-settings.reducer';
import {
  SAVE_APP_SETTINGS_START,
  CHANGE_DEFAULT_PROJECT_PATH,
} from '../actions';

describe('App-Settings reducer', () => {
  it('should return initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  it(`should handle ${SAVE_APP_SETTINGS_START}`, () => {
    const prevState = initialState;
    const testPath = '~/some/new/path';
    const action = {
      type: SAVE_APP_SETTINGS_START,
      settings: {
        ...initialState,
        general: {
          ...initialState.general,
          defaultProjectPath: testPath,
        },
      },
    };

    expect(reducer(prevState, action).general.defaultProjectPath).toEqual(
      testPath
    );
  });

  describe('should change default project path', () => {
    it('updates the `defaultProjectPath` field', () => {
      const prevState = {
        ...initialState,
        general: {
          defaultProjectPath: 'this/is/home',
        },
      };

      const action = {
        type: CHANGE_DEFAULT_PROJECT_PATH,
        defaultProjectPath: 'Users/john_doe/work',
      };

      expect(reducer(prevState, action)).toMatchInlineSnapshot(`
Object {
  "general": Object {
    "defaultProjectPath": "Users/john_doe/work",
  },
  "privacy": Object {
    "enableUsageTracking": true,
  },
}
`);
    });
  });

  it('should select the right key', () => {
    const prevState = {
      appSettings: {
        ...initialState,
        general: {
          ...initialState.general,
          defaultProjectPath: '/some/path',
        },
      },
    };

    expect(getDefaultProjectPath(prevState)).toEqual('/some/path');
    expect(getDefaultProjectType(prevState)).toEqual('create-react-app');
    expect(getPrivacySettings(prevState)).toBeTruthy();
  });

  it('should return the appSettings state', () => {
    const prevState = reducer();

    expect(getAppSettings({ appSettings: prevState })).toEqual(initialState);
  });
});
