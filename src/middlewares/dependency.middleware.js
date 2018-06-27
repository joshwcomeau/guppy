import {
  ADD_DEPENDENCY_START,
  UPDATE_DEPENDENCY_START,
  DELETE_DEPENDENCY_START,
  addDependencyFinish,
  addDependencyError,
  updateDependencyFinish,
  updateDependencyError,
  deleteDependencyFinish,
  deleteDependencyError,
} from '../actions';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { loadProjectDependency } from '../services/read-from-disk.service';
import {
  installDependency,
  uninstallDependency,
} from '../services/dependencies.service';

//
//
export default store => next => action => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case ADD_DEPENDENCY_START: {
      const { projectId, dependencyName, version } = action;

      const projectPath = getPathForProjectId(projectId, store.getState());

      installDependency(projectPath, dependencyName, version)
        .then(() => loadProjectDependency(projectPath, dependencyName))
        .then(dependency => {
          next(addDependencyFinish(projectId, dependency));
        })
        .catch(err => {
          // TODO: system prompt leting the user know.
          console.error('Failed to install dependency', err);
          next(addDependencyError(projectId, dependencyName));
        });

      break;
    }

    case UPDATE_DEPENDENCY_START: {
      const { projectId, dependencyName, latestVersion } = action;

      const projectPath = getPathForProjectId(projectId, store.getState());

      installDependency(projectPath, dependencyName, latestVersion)
        .then(() => {
          next(
            updateDependencyFinish(projectId, dependencyName, latestVersion)
          );
        })
        .catch(err => {
          // TODO: system prompt leting the user know.
          console.error('Failed to update dependency', err);
          next(updateDependencyError(projectId, dependencyName));
        });

      break;
    }

    case DELETE_DEPENDENCY_START: {
      const { projectId, dependencyName } = action;

      const projectPath = getPathForProjectId(projectId, store.getState());

      uninstallDependency(projectPath, dependencyName)
        .then(() => {
          next(deleteDependencyFinish(projectId, dependencyName));
        })
        .catch(err => {
          // TODO: system prompt leting the user know.
          console.error('Failed to delete dependency', err);
          next(deleteDependencyError(projectId, dependencyName));
        });
      break;
    }
  }

  // Pass all actions through
  return next(action);
};
