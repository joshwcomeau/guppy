// @flow
import { remote } from 'electron';
import {
  SHOW_IMPORT_EXISTING_PROJECT_PROMPT,
  IMPORT_EXISTING_PROJECT_START,
  importExistingProjectStart,
  importExistingProjectFinish,
  importExistingProjectError,
} from '../actions';
import { getInternalProjectById } from '../reducers/projects.reducer';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { getColorForProject } from '../services/create-project.service';

const { dialog } = remote;

// TODO: Flow types
export default (store: any) => (next: any) => (action: any) => {
  // Pass all actions through
  next(action);

  switch (action.type) {
    case SHOW_IMPORT_EXISTING_PROJECT_PROMPT: {
      dialog.showOpenDialog(
        {
          message: 'Select the directory of an existing React app',
          properties: ['openDirectory'],
        },
        paths => {
          // The user might cancel out without selecting a directory.
          // In that case, do nothing.
          if (!paths) {
            return;
          }

          // Only a single path should be selected
          const [path] = paths;

          store.dispatch(importExistingProjectStart(path));
        }
      );

      return;
    }

    case IMPORT_EXISTING_PROJECT_START: {
      const { path } = action;

      const state = store.getState();

      // Let's load the basic project info for the path specified, if possible.
      loadPackageJson(path)
        .then(json => {
          const projectId = json.name;

          // Check to see if we already have a project with this ID.
          // In the future, maybe I can attach a suffix like `-copy`, but for
          // now I'll just reject it outright.
          if (getInternalProjectById(state, projectId)) {
            throw new Error('project-name-already-exists');
          }

          const type = inferProjectType(json);
          if (!type) {
            // Guppy only supports create-react-app and Gatsby projects atm.
            // Hopefully one day, arbitrary projects will have first-class
            // support... but for now, I'm prioritizing an A+ experience for
            // supported project types.

            throw new Error('unsupported-project-type');
          }

          // Get a random colour for the project, to be used in place of an
          // icon.
          // TODO: Try importing the existing project's favicon as icon instead?
          const packageJsonWithGuppy = {
            ...json,
            guppy: {
              id: json.name,
              name: json.name,
              type,
              color: getColorForProject(json.name),
              icon: null,
              createdAt: Date.now(),
            },
          };

          return packageJsonWithGuppy;
        })
        .then(json => writePackageJson(path, json))
        .then(json => {
          next(importExistingProjectFinish(path, json));
        })
        .catch(err => {
          switch (err.message) {
            case 'project-name-already-exists': {
              dialog.showErrorBox(
                'Project name already exists',
                "Egad! A project with that name already exists. Are you sure it hasn't already been imported?"
              );
              break;
            }

            case 'unsupported-project-type': {
              dialog.showErrorBox(
                'Unsupported project type',
                "Looks like the project you're trying to import isn't supported. Unfortunately, Guppy only supports projects created with create-react-app or Gatsby"
              );
              break;
            }

            default: {
              console.error(err);

              dialog.showErrorBox(
                'Unknown error',
                'An unknown error has occurred. Sorry about that! Details have been printed to the console.'
              );
              break;
            }
          }

          next(importExistingProjectError());
        });

      return;
    }

    default: {
      return;
    }
  }
};

const inferProjectType = json => {
  // Some projects only have devDependencies.
  // If this is the case, we can bail early, since no supported project types
  // avoid having `dependencies`.
  if (!json.dependencies) {
    return null;
  }

  const dependencyNames = Object.keys(json.dependencies);

  if (dependencyNames.includes('gatsby')) {
    return 'gatsby';
  } else if (dependencyNames.includes('react-scripts')) {
    return 'create-react-app';
  }

  // An ejected create-react-app won't have `react-scripts`.
  // So it actually becomes kinda hard to figure out what kind of project it is!
  // One strong clue is that it will have `eslint-config-react-app` as a
  // dependency... this isn't foolproof since a user could easily uninstall
  // that dependency, but it'll work for now.
  // In the future, could also check the `config` dir for the standard React
  // scripts
  if (dependencyNames.includes('eslint-config-react-app')) {
    return 'create-react-app';
  }

  return null;
};
