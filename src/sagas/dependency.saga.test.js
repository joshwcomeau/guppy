/* eslint-disable flowtype/require-valid-file-annotation */
import { select, call, put, takeEvery } from 'redux-saga/effects';
import rootSaga, {
  handleAddDependency,
  handleUpdateDependency,
  handleDeleteDependency,
  handleInstallDependenciesStart,
  handleUninstallDependenciesStart,
} from './dependency.saga';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { getNextActionForProjectId } from '../reducers/queue.reducer';
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
  UNINSTALL_DEPENDENCIES_START,
  queueDependencyInstall,
  queueDependencyUninstall,
  installDependenciesError,
  installDependenciesFinish,
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
      saga = handleAddDependency(action);
    });

    it('should immediately install on empty queue', () => {
      const queuedAction = null;

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, { projectId })
      );
      expect(saga.next(queuedAction).value).toEqual(
        put(
          queueDependencyInstall(projectId, dependency.name, dependency.version)
        )
      );
      expect(saga.next().value).toEqual(put(startNextActionInQueue(projectId)));
      expect(saga.next().done).toBe(true);
    });

    it('should queue install on non-empty queue', () => {
      const queuedAction = {
        action: 'install',
        active: true,
        dependencies: [{ name: 'redux' }],
      };

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, { projectId })
      );
      expect(saga.next(queuedAction).value).toEqual(
        put(
          queueDependencyInstall(projectId, dependency.name, dependency.version)
        )
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
      saga = handleUpdateDependency(action);
    });

    it('should immediately install on empty queue', () => {
      const queuedAction = false;

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, { projectId })
      );
      expect(saga.next(queuedAction).value).toEqual(
        put(
          queueDependencyInstall(
            projectId,
            dependency.name,
            dependency.version,
            dependency.updating
          )
        )
      );
      expect(saga.next().value).toEqual(put(startNextActionInQueue(projectId)));
      expect(saga.next().done).toBe(true);
    });

    it('should queue install on non-empty queue', () => {
      const queuedAction = {
        action: 'install',
        active: true,
        dependencies: [{ name: 'redux' }],
      };

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, { projectId })
      );
      expect(saga.next(queuedAction).value).toEqual(
        put(
          queueDependencyInstall(
            projectId,
            dependency.name,
            dependency.version,
            dependency.updating
          )
        )
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
      saga = handleDeleteDependency(action);
    });

    it('should immediately uninstall on empty queue', () => {
      const queuedAction = null;

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, { projectId })
      );
      expect(saga.next(queuedAction).value).toEqual(
        put(queueDependencyUninstall(projectId, dependency.name))
      );
      expect(saga.next().value).toEqual(put(startNextActionInQueue(projectId)));
      expect(saga.next().done).toBe(true);
    });

    it('should queue uninstall on non-empty queue', () => {
      const queuedAction = {
        action: 'install',
        active: true,
        dependencies: [{ name: 'redux' }],
      };

      expect(saga.next().value).toEqual(
        select(getNextActionForProjectId, { projectId })
      );
      expect(saga.next(queuedAction).value).toEqual(
        put(queueDependencyUninstall(projectId, dependency.name))
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
      saga = handleInstallDependenciesStart(action);
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

      expect(saga.next().value).toEqual(
        select(getPathForProjectId, { projectId })
      );
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

      expect(saga.next().value).toEqual(
        select(getPathForProjectId, { projectId })
      );
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
      saga = handleUninstallDependenciesStart(action);
    });

    it('should uninstall dependencies', () => {
      expect(saga.next().value).toEqual(
        select(getPathForProjectId, { projectId })
      );
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

      expect(saga.next().value).toEqual(
        select(getPathForProjectId, { projectId })
      );
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

  describe('root saga', () => {
    it('should start watching for actions', () => {
      const saga = rootSaga();

      expect(saga.next().value).toEqual(
        takeEvery(ADD_DEPENDENCY, handleAddDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(UPDATE_DEPENDENCY, handleUpdateDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(DELETE_DEPENDENCY, handleDeleteDependency)
      );
      expect(saga.next().value).toEqual(
        takeEvery(INSTALL_DEPENDENCIES_START, handleInstallDependenciesStart)
      );
      expect(saga.next().value).toEqual(
        takeEvery(
          UNINSTALL_DEPENDENCIES_START,
          handleUninstallDependenciesStart
        )
      );
      expect(saga.next().done).toBe(true);
    });
  });
});
