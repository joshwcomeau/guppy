import { select, call, put, takeEvery } from 'redux-saga/effects';
import rootSaga, {
  addDependency,
  updateDependency,
  deleteDependency,
  startInstallingDependencies,
  startUninstallingDependencies,
  handleQueueActionCompleted,
  handleNextActionInQueue,
} from './dependency.saga';
import { getPathForProjectId } from '../reducers/paths.reducer';
import {
  getPackageJsonLockedForProjectId,
  getNextActionForProjectId,
} from '../reducers/queue.reducer';
import {
  installDependencies,
  uninstallDependencies,
} from '../services/dependencies.service';
import { loadProjectDependencies } from '../services/read-from-disk.service';
import {
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  INSTALL_DEPENDENCIES_START,
  INSTALL_DEPENDENCIES_ERROR,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_START,
  UNINSTALL_DEPENDENCIES_ERROR,
  UNINSTALL_DEPENDENCIES_FINISH,
  START_NEXT_ACTION_IN_QUEUE,
  queueDependencyInstall,
  queueDependencyUninstall,
  installDependencyStart,
  installDependenciesStart,
  installDependenciesError,
  installDependenciesFinish,
  uninstallDependencyStart,
  uninstallDependenciesStart,
  uninstallDependenciesError,
  uninstallDependenciesFinish,
  startNextActionInQueue,
} from '../actions';

describe('Dependency sagas', () => {
  const projectId = 'foo';
  const projectPath = '/path/to/project';

  describe('addDependency saga', () => {
    const action = {
      projectId,
      dependencyName: 'redux',
      version: '2.3',
    };
    const dependency = {
      name: 'redux',
      version: '2.3',
    };

    let saga;
    beforeEach(() => {
      saga = addDependency(action);
    });

    it('should immediately install on empty queue', () => {
      const packageJsonLocked = false;

      expect(saga.next().value).toEqual(
        select(getPackageJsonLockedForProjectId, projectId)
      );
      expect(saga.next(packageJsonLocked).value).toEqual(
        put(installDependencyStart(projectId, dependency))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should queue install on non-empty queue', () => {
      const packageJsonLocked = true;

      expect(saga.next().value).toEqual(
        select(getPackageJsonLockedForProjectId, projectId)
      );
      expect(saga.next(packageJsonLocked).value).toEqual(
        put(queueDependencyInstall(projectId, dependency))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('updateDependency saga', () => {
    const action = {
      projectId,
      dependencyName: 'redux',
      latestVersion: '2.3',
    };
    const dependency = {
      name: 'redux',
      version: '2.3',
      updating: true,
    };

    let saga;
    beforeEach(() => {
      saga = updateDependency(action);
    });

    it('should immediately install on empty queue', () => {
      const packageJsonLocked = false;

      expect(saga.next().value).toEqual(
        select(getPackageJsonLockedForProjectId, projectId)
      );
      expect(saga.next(packageJsonLocked).value).toEqual(
        put(installDependencyStart(projectId, dependency))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should queue install on non-empty queue', () => {
      const packageJsonLocked = true;

      expect(saga.next().value).toEqual(
        select(getPackageJsonLockedForProjectId, projectId)
      );
      expect(saga.next(packageJsonLocked).value).toEqual(
        put(queueDependencyInstall(projectId, dependency))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('deleteDependency saga', () => {
    const action = {
      projectId,
      dependencyName: 'redux',
      version: '2.3',
    };
    const dependency = {
      name: 'redux',
    };

    let saga;
    beforeEach(() => {
      saga = deleteDependency(action);
    });

    it('should immediately uninstall on empty queue', () => {
      const packageJsonLocked = false;

      expect(saga.next().value).toEqual(
        select(getPackageJsonLockedForProjectId, projectId)
      );
      expect(saga.next(packageJsonLocked).value).toEqual(
        put(uninstallDependencyStart(projectId, dependency))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should queue uninstall on non-empty queue', () => {
      const packageJsonLocked = true;

      expect(saga.next().value).toEqual(
        select(getPackageJsonLockedForProjectId, projectId)
      );
      expect(saga.next(packageJsonLocked).value).toEqual(
        put(queueDependencyUninstall(projectId, dependency))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('startInstallingDependencies saga', () => {
    const action = {
      projectId,
      dependencies: [
        { name: 'redux', version: '3.3' },
        { name: 'react-redux', version: '3.0', updating: true },
      ],
    };

    let saga;
    beforeEach(() => {
      saga = startInstallingDependencies(action);
    });

    it('should install dependencies', () => {
      const storedDependencies = [
        {
          name: 'redux',
          version: '3.3',
          location: 'dependencies',
          description: 'foo',
        },
        {
          name: 'react-redux',
          version: '3.0',
          location: 'dependencies',
          description: 'bar',
        },
      ];

      expect(saga.next().value).toEqual(select(getPathForProjectId, projectId));
      expect(saga.next(projectPath).value).toEqual(
        call(installDependencies, projectPath, action.dependencies)
      );
      expect(saga.next().value).toEqual(
        call(loadProjectDependencies, projectPath, action.dependencies)
      );
      expect(saga.next(storedDependencies).value).toEqual(
        put(installDependenciesFinish(projectId, storedDependencies))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should handle error', () => {
      const error = new Error('oops');

      expect(saga.next().value).toEqual(select(getPathForProjectId, projectId));
      saga.next(projectPath);
      expect(saga.throw(error).value).toEqual(
        call([console, console.error], 'Failed to install dependencies', error)
      );
      expect(saga.next().value).toEqual(
        put(installDependenciesError(projectId, action.dependencies))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('startUninstallingDependencies saga', () => {
    const action = {
      projectId,
      dependencies: [{ name: 'redux' }, { name: 'react-redux' }],
    };

    let saga;
    beforeEach(() => {
      saga = startUninstallingDependencies(action);
    });

    it('should uninstall dependencies', () => {
      expect(saga.next().value).toEqual(select(getPathForProjectId, projectId));
      expect(saga.next(projectPath).value).toEqual(
        call(uninstallDependencies, projectPath, action.dependencies)
      );
      expect(saga.next().value).toEqual(
        put(uninstallDependenciesFinish(projectId, action.dependencies))
      );
      expect(saga.next().done).toBe(true);
    });

    it('should handle error', () => {
      const error = new Error('oops');

      expect(saga.next().value).toEqual(select(getPathForProjectId, projectId));
      saga.next(projectPath);
      expect(saga.throw(error).value).toEqual(
        call(
          [console, console.error],
          'Failed to uninstall dependencies',
          error
        )
      );
      expect(saga.next().value).toEqual(
        put(uninstallDependenciesError(projectId, action.dependencies))
      );
      expect(saga.next().done).toBe(true);
    });
  });

  describe('handleQueueActionCompleted saga', () => {
    it(`should dispatch ${START_NEXT_ACTION_IN_QUEUE}`, () => {
      const saga = handleQueueActionCompleted({ projectId });

      expect(saga.next().value).toEqual(put(startNextActionInQueue(projectId)));
      expect(saga.next().done).toBe(true);
    });
  });

  describe('handleNextActionInQueue saga', () => {
    let saga;
    beforeEach(() => {
      saga = handleNextActionInQueue({ projectId });
    });

    it('should do nothing if the queue is empty', () => {
      const nextAction = null;

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, projectId)
      );
      expect(saga.next(nextAction).value).toEqual(undefined);
      expect(saga.next().done).toBe(true);
    });

    it(`should dispatch ${INSTALL_DEPENDENCIES_START} if an install action is queued`, () => {
      const nextAction = {
        action: 'install',
        dependencies: [{ name: 'redux' }],
      };

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, projectId)
      );
      expect(saga.next(nextAction).value).toEqual(
        put(installDependenciesStart(projectId, nextAction.dependencies))
      );
    });

    it(`should dispatch ${UNINSTALL_DEPENDENCIES_START} if an uninstall action is queued`, () => {
      const nextAction = {
        action: 'uninstall',
        dependencies: [{ name: 'redux' }],
      };

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, projectId)
      );
      expect(saga.next(nextAction).value).toEqual(
        put(uninstallDependenciesStart(projectId, nextAction.dependencies))
      );
    });
  });

  describe('root saga', () => {
    it('should start watching for actions', () => {
      const saga = rootSaga();

      expect(saga.next().value).toEqual(
        takeEvery(ADD_DEPENDENCY, addDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(UPDATE_DEPENDENCY, updateDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(DELETE_DEPENDENCY, deleteDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(INSTALL_DEPENDENCIES_START, startInstallingDependencies)
      );
      expect(saga.next().value).toEqual(
        takeEvery(UNINSTALL_DEPENDENCIES_START, startUninstallingDependencies)
      );
      expect(saga.next().value).toEqual(
        takeEvery(
          [
            INSTALL_DEPENDENCIES_ERROR,
            INSTALL_DEPENDENCIES_FINISH,
            UNINSTALL_DEPENDENCIES_ERROR,
            UNINSTALL_DEPENDENCIES_FINISH,
          ],
          handleQueueActionCompleted
        )
      );
      expect(saga.next().value).toEqual(
        takeEvery(START_NEXT_ACTION_IN_QUEUE, handleNextActionInQueue)
      );
      expect(saga.next().done).toBe(true);
    });
  });
});
