import reducer, {
  initialState,
  getDefaultProjectPath,
} from './app-settings.reducer';
import { SAVE_APP_SETTINGS_START } from '../actions';

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
});
