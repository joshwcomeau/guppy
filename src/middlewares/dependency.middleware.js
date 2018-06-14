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
import { loadProjectDependency } from '../services/read-from-disk.service';

const childProcess = window.require('child_process');
const os = window.require('os');

// When the app first loads, we need to get an index of existing projects.
// The default path for projects is `~/guppy-projects`.
// TODO: Make this configurable!
const parentPath = `${os.homedir()}/guppy-projects`;

export default store => next => action => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case ADD_DEPENDENCY_START: {
      const { projectId, dependencyName, version } = action;

      // TODO: This will need to be rethought soon, when we allow for projects
      // to live elsewhere.
      const projectPath = `${parentPath}/${projectId}`;

      // TODO: yarn?
      childProcess.exec(
        `npm install ${dependencyName}@${version} -SE`,
        {
          cwd: projectPath,
        },
        (error, res) => {
          if (error) {
            // TODO: system prompt leting the user know.
            console.error('Failed to install dependency', error);
            next(addDependencyError(projectId, dependencyName));
            return;
          }

          // We need to read the dependency from disk, to find out all our
          // standard information.
          loadProjectDependency(projectId, dependencyName)
            .then(dependency => {
              next(addDependencyFinish(projectId, dependency));
            })
            .catch(err => {
              console.error('Could not load dependency after install', err);
              next(addDependencyError(projectId, dependencyName));
            });
        }
      );

      break;
    }

    case UPDATE_DEPENDENCY_START: {
      const { projectId, dependencyName, latestVersion } = action;

      // TODO: This will need to be rethought soon, when we allow for projects
      // to live elsewhere.
      const projectPath = `${parentPath}/${projectId}`;

      // TODO: yarn?
      childProcess.exec(
        `npm install ${dependencyName}@${latestVersion} -SE`,
        {
          cwd: projectPath,
        },
        (error, res) => {
          if (error) {
            // TODO: system prompt leting the user know.
            next(updateDependencyError(projectId, dependencyName));
            return;
          }

          next(
            updateDependencyFinish(projectId, dependencyName, latestVersion)
          );
        }
      );
      break;
    }
    case DELETE_DEPENDENCY_START: {
      const { projectId, dependencyName } = action;

      // TODO: This will need to be rethought soon, when we allow for projects
      // to live elsewhere.
      const projectPath = `${parentPath}/${projectId}`;

      // TODO: yarn?
      childProcess.exec(
        `npm uninstall ${dependencyName}`,
        {
          cwd: projectPath,
        },
        (error, res) => {
          if (error) {
            // TODO: system prompt leting the user know.
            next(deleteDependencyError(projectId, dependencyName));
            return;
          }

          next(deleteDependencyFinish(projectId, dependencyName));
        }
      );
      break;
    }
  }

  // Pass all actions through
  return next(action);
};
