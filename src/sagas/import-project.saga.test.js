/* eslint-disable flowtype/require-valid-file-annotation */
import electron from 'electron'; // Mocked
import { call, put, cancel, select, takeEvery } from 'redux-saga/effects';
import rootSaga, {
  handlePathInput,
  showImportDialog,
  handleImportError,
  importProject,
  inferProjectType,
} from './import-project.saga';
import {
  importExistingProjectStart,
  importExistingProjectError,
  importExistingProjectFinish,
  SHOW_IMPORT_EXISTING_PROJECT_PROMPT,
  IMPORT_EXISTING_PROJECT_START,
} from '../actions';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { getOnboardingCompleted } from '../reducers/onboarding-status.reducer';
import { getInternalProjectById } from '../reducers/projects.reducer';
import { getColorForProject } from '../services/create-project.service';

jest.mock('uuid/v1', () => () => 'mocked-uuid-v1');

describe('import-project saga', () => {
  const { showOpenDialog, showErrorBox } = electron.remote.dialog;

  describe('handlePathInput saga', () => {
    it('should do nothing if argument paths is undefined', () => {
      const saga = handlePathInput();
      expect(saga.next().value).toEqual(cancel());
    });

    it('should get only first path from passed array and start importing', () => {
      const paths = ['path/to/first', 'path/to/second'];
      const saga = handlePathInput(paths);
      expect(saga.next().value).toEqual(
        put(importExistingProjectStart('path/to/first'))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('showImportDialog saga', () => {
    it('should show import dialog to user', () => {
      const saga = showImportDialog();
      expect(saga.next().value).toEqual(
        call(showOpenDialog, {
          message: 'Select the directory of an existing React app',
          properties: ['openDirectory'],
        })
      );
      expect(saga.next(['path/to/project']).value).toEqual(
        call(handlePathInput, ['path/to/project'])
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('handleImportError saga', () => {
    it('should handle project-name-already-exists error', () => {
      const error = new Error('project-name-already-exists');
      const saga = handleImportError(error);
      expect(saga.next().value).toEqual(
        call(
          showErrorBox,
          'Project name already exists',
          "Egad! A project with that name already exists. Are you sure it hasn't already been imported?"
        )
      );
      expect(saga.next().done).toBe(true);
    });

    it('should handle unsupported-project-type error', () => {
      const error = new Error('unsupported-project-type');
      const saga = handleImportError(error);
      expect(saga.next().value).toEqual(
        call(
          showErrorBox,
          'Unsupported project type',
          "Looks like the project you're trying to import isn't supported. Unfortunately, Guppy only supports projects created with create-react-app or Gatsby"
        )
      );
      expect(saga.next().done).toBe(true);
    });

    it('should handle any other errors', () => {
      const error = new Error('unknown error');
      const saga = handleImportError(error);
      expect(saga.next().value).toEqual(call([console, console.error], error));
      expect(saga.next().value).toEqual(
        call(
          showErrorBox,
          'Unknown error',
          'An unknown error has occurred. Sorry about that! Details have been printed to the console.'
        )
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('importProject saga', () => {
    const startAction = { path: 'path/to/project' };
    let json;
    beforeEach(() => {
      json = {
        name: 'example',
        version: '0.1.0',
        private: true,
        dependencies: {
          react: '^16.4.1',
          'react-dom': '^16.4.1',
          'react-image-magnify': '^2.7.0',
          'react-router': '^4.3.1',
          'react-router-dom': '^4.3.1',
          'react-scripts': '1.1.4',
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test --env=jsdom',
          eject: 'react-scripts eject',
        },
      };
    });

    it('should throw error if project already exist', () => {
      const saga = importProject(startAction);
      const expectedError = new Error('project-name-already-exists');
      expect(saga.next().value).toEqual(
        call(loadPackageJson, 'path/to/project')
      );
      expect(saga.next(json).value).toEqual(
        select(getInternalProjectById, { projectId: 'mocked-uuid-v1' })
      );
      expect(saga.next({ name: 'example' }).value).toEqual(
        call(handleImportError, expectedError)
      );
      expect(saga.next().value).toEqual(put(importExistingProjectError()));
      expect(saga.next().done).toBe(true);
    });

    it('should throw error if project have unsupported type', () => {
      const saga = importProject(startAction);
      const expectedError = new Error('unsupported-project-type');
      expect(saga.next().value).toEqual(
        call(loadPackageJson, 'path/to/project')
      );
      expect(saga.next(json).value).toEqual(
        select(getInternalProjectById, { projectId: 'mocked-uuid-v1' })
      );
      expect(saga.next().value).toEqual(call(inferProjectType, json));
      expect(saga.next(null).value).toEqual(
        call(handleImportError, expectedError)
      );
      expect(saga.next().value).toEqual(put(importExistingProjectError()));
      expect(saga.next().done).toBe(true);
    });

    it('should import project', () => {
      const saga = importProject(startAction);
      const jsonWithGuppy = {
        ...json,
        guppy: {
          id: 'mocked-uuid-v1',
          name: 'example',
          type: 'create-react-app',
          color: '#cc004a',
          icon: null,
          createdAt: 1532809641976,
        },
      };

      const spyOnDate = jest.spyOn(Date, 'now');
      spyOnDate.mockReturnValue(1532809641976);

      expect(saga.next().value).toEqual(
        call(loadPackageJson, 'path/to/project')
      );
      expect(saga.next(json).value).toEqual(
        select(getInternalProjectById, { projectId: 'mocked-uuid-v1' })
      );
      expect(saga.next().value).toEqual(call(inferProjectType, json));
      expect(saga.next('create-react-app').value).toEqual(
        call(getColorForProject, 'example')
      );
      expect(saga.next('#cc004a').value).toEqual(
        call(writePackageJson, 'path/to/project', jsonWithGuppy)
      );
      expect(saga.next(jsonWithGuppy).value).toEqual(
        select(getOnboardingCompleted)
      );
      expect(saga.next(true).value).toEqual(
        put(
          importExistingProjectFinish(
            'path/to/project',
            jsonWithGuppy,
            'create-react-app',
            true
          )
        )
      );
      expect(saga.next().done).toBe(true);
      spyOnDate.mockRestore();
    });
  });

  describe('root import-project saga', () => {
    it('should watching for start actions', () => {
      const saga = rootSaga();

      expect(saga.next().value).toEqual(
        takeEvery(SHOW_IMPORT_EXISTING_PROJECT_PROMPT, showImportDialog)
      );
      expect(saga.next().value).toEqual(
        takeEvery(IMPORT_EXISTING_PROJECT_START, importProject)
      );
    });
  });

  describe('inferProjectType helper', () => {
    it('should return null if field "dependencies" not exist in json', () => {
      const json = {
        name: 'example',
        version: '0.1.0',
        private: true,
        devDependencies: {},
      };
      expect(inferProjectType(json)).toBeNull();
    });

    it('should return null if nothing in dependencies can help to identify type of app', () => {
      const json = {
        name: 'example',
        version: '0.1.0',
        private: true,
        dependencies: {
          react: '^16.4.1',
          'react-dom': '^16.4.1',
          'react-router': '^4.3.1',
        },
      };

      expect(inferProjectType(json)).toBeNull();
    });

    it('should return "gatsby" if json have gatsby dependency', () => {
      const json = {
        name: 'example',
        version: '0.1.0',
        private: true,
        dependencies: {
          react: '^16.4.1',
          'react-dom': '^16.4.1',
          gatsby: '1.9.277',
        },
      };

      expect(inferProjectType(json)).toBe('gatsby');
    });

    it('should return "create-react-app" if json have dependency react-scripts', () => {
      const json = {
        name: 'example',
        version: '0.1.0',
        private: true,
        dependencies: {
          react: '^16.4.1',
          'react-dom': '^16.4.1',
          'react-scripts': '1.1.4',
        },
      };

      expect(inferProjectType(json)).toBe('create-react-app');
    });

    it('should return "create-react-app" if json have dependency eslint-config-react-app', () => {
      const json = {
        name: 'example',
        version: '0.1.0',
        private: true,
        dependencies: {
          react: '^16.4.1',
          'react-dom': '^16.4.1',
          'eslint-config-react-app': '2.1.0',
        },
      };

      expect(inferProjectType(json)).toBe('create-react-app');
    });
  });
});
