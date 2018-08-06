import { select, call, put, takeEvery } from 'redux-saga/effects';
import rootSaga, {
  addDependency,
  updateDependency,
  deleteDependency,
} from './dependency.saga';
import { getPathForProjectId } from '../reducers/paths.reducer';
import {
  installDependency,
  uninstallDependency,
} from '../services/dependencies.service';
import { loadProjectDependency } from '../services/read-from-disk.service';
import {
  addDependencyFinish,
  addDependencyError,
  updateDependencyFinish,
  updateDependencyError,
  deleteDependencyFinish,
  deleteDependencyError,
  ADD_DEPENDENCY_START,
  UPDATE_DEPENDENCY_START,
  DELETE_DEPENDENCY_START,
} from '../actions';

jest.mock('../services/read-from-disk.service');

describe('Dependency sagas', () => {
  describe('addDependency saga', () => {
    const startAction = {
      projectId: 'foo',
      dependencyName: 'redux',
      version: '2.3',
    };
    const dependency = {
      name: 'redux',
      version: '2.3',
    };

    it('should install new dependency', () => {
      const saga = addDependency(startAction);
      expect(saga.next().value).toEqual(select(getPathForProjectId, 'foo'));
      expect(saga.next('/path/to/project/').value).toEqual(
        call(installDependency, '/path/to/project/', 'redux', '2.3')
      );
      expect(saga.next().value).toEqual(
        call(loadProjectDependency, '/path/to/project/', 'redux')
      );
      expect(saga.next(dependency).value).toEqual(
        put(addDependencyFinish('foo', dependency))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should handle error', () => {
      const error = new Error('something wrong');
      const saga = addDependency(startAction);
      expect(saga.next().value).toEqual(select(getPathForProjectId, 'foo'));
      expect(saga.next('/path/to/project/').value).toEqual(
        call(installDependency, '/path/to/project/', 'redux', '2.3')
      );
      expect(saga.throw(error).value).toEqual(
        call([console, 'error'], 'Failed to install dependency', error)
      );
      expect(saga.next().value).toEqual(
        put(addDependencyError('foo', 'redux'))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('updateDependency saga', () => {
    const startAction = {
      projectId: 'foo',
      dependencyName: 'redux',
      latestVersion: '2.5',
    };

    it('should update dependency', () => {
      const saga = updateDependency(startAction);
      expect(saga.next().value).toEqual(select(getPathForProjectId, 'foo'));
      expect(saga.next('/path/to/project/').value).toEqual(
        call(installDependency, '/path/to/project/', 'redux', '2.5')
      );
      expect(saga.next().value).toEqual(
        put(updateDependencyFinish('foo', 'redux', '2.5'))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should handle error', () => {
      const error = new Error('some error');
      const saga = updateDependency(startAction);
      expect(saga.next().value).toEqual(select(getPathForProjectId, 'foo'));
      expect(saga.next('/path/to/project/').value).toEqual(
        call(installDependency, '/path/to/project/', 'redux', '2.5')
      );
      expect(saga.throw(error).value).toEqual(
        call([console, 'error'], 'Failed to update dependency', error)
      );
      expect(saga.next().value).toEqual(
        put(updateDependencyError('foo', 'redux'))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('deleteDependency saga', () => {
    const startAction = {
      projectId: 'foo',
      dependencyName: 'redux',
    };

    it('should delete demendency', () => {
      const saga = deleteDependency(startAction);
      expect(saga.next().value).toEqual(select(getPathForProjectId, 'foo'));
      expect(saga.next('/path/to/project/').value).toEqual(
        call(uninstallDependency, '/path/to/project/', 'redux')
      );
      expect(saga.next().value).toEqual(
        put(deleteDependencyFinish('foo', 'redux'))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should handle error', () => {
      const error = new Error('some error');
      const saga = deleteDependency(startAction);
      expect(saga.next().value).toEqual(select(getPathForProjectId, 'foo'));
      expect(saga.next('/path/to/project/').value).toEqual(
        call(uninstallDependency, '/path/to/project/', 'redux')
      );
      expect(saga.throw(error).value).toEqual(
        call([console, 'error'], 'Failed to delete dependency', error)
      );
      expect(saga.next().value).toEqual(
        put(deleteDependencyError('foo', 'redux'))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('dependencies root saga', () => {
    it('should watching for start actions', () => {
      const saga = rootSaga();

      expect(saga.next().value).toEqual(
        takeEvery(ADD_DEPENDENCY_START, addDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(UPDATE_DEPENDENCY_START, updateDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(DELETE_DEPENDENCY_START, deleteDependency)
      );
      expect(saga.next().done).toBe(true);
    });
  });
});
