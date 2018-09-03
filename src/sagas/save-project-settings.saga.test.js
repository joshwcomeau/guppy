import electron from 'electron'; // Mocked
import { call, put, select, takeEvery } from 'redux-saga/effects';

import rootSaga, {
  handleSaveSettings,
  renameFolder,
} from './save-project-settings.saga';

import {
  SAVE_PROJECT_SETTINGS_START,
  // saveProjectSettingsStart,
  saveProjectSettingsFinish,
} from '../actions';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';

jest.mock('path', () => ({
  resolve: jest.fn(),
  join: jest.fn(),
}));

// jest.mock('fs', () => ({
//   renameSync: jest.fn(),
// }));

describe('save-project-settings saga', () => {
  describe('root import-project saga', () => {
    it('should watching for start actions', () => {
      const saga = rootSaga();
      expect(saga.next().value).toEqual(
        takeEvery(SAVE_PROJECT_SETTINGS_START, handleSaveSettings)
      );
    });
  });

  describe('saveProjectSettings', () => {
    it('should save settings', () => {
      const { dialog } = electron.remote;
      const json = { name: 'project', guppy: { id: 'project', icon: null } };
      const action = {
        name: 'new-project',
        icon: 'icon',
        project: { id: 'project', path: 'path/to/project' },
      };
      const saga = handleSaveSettings(action);

      // Load package.json
      expect(saga.next().value).toEqual(
        call(loadPackageJson, 'path/to/project')
      );

      // renameFolder called
      // expect(saga.next().value).toEqual(
      //   call(renameFolder, 'path/to/project', 'path/to/new-project')
      // );

      // Show confirmation for imported projects if name changed
      // console.log('next val', saga.next(json).value);
      // expect(saga.next().value).toEqual(call([dialog, dialog.showMessageBox]));
      // Write package.json
      // expect(saga.next(json).value).toEqual(call(writePackageJson));

      // expect(saga.next(json).value).toEqual(
      //   put(
      //     saveProjectSettingsFinish({
      //       guppy: { icon: 'icon', id: 'new-project', name: 'new-project' },
      //       name: 'new-project',
      //     })
      //   )
      // );

      // Should update state & close modal
    });
  });
});
