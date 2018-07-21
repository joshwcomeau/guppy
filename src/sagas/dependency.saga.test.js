import { select, call, put } from 'redux-saga/effects';
import { addDependency } from './dependency.saga';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { installDependency } from '../services/dependencies.service';
import { loadProjectDependency } from '../services/read-from-disk.service';
import { addDependencyFinish, addDependencyError } from '../actions';

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
});
