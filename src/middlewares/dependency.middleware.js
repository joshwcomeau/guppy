import {
  DELETE_DEPENDENCY_START,
  deleteDependencyFinish,
  deleteDependencyError,
} from '../actions';
import { getProjectById } from '../reducers/projects.reducer';

const childProcess = window.require('child_process');
const os = window.require('os');

// When the app first loads, we need to get an index of existing projects.
// The default path for projects is `~/guppy-projects`.
// TODO: Make this configurable!
const parentPath = `${os.homedir()}/guppy-projects`;

export default store => next => action => {
  switch (action.type) {
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
