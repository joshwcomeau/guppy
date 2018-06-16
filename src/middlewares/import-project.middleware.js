// @flow
import {
  IMPORT_EXISTING_PROJECT_START,
  importExistingProjectFinish,
} from '../actions';
import { getInternalProjectById } from '../reducers/projects.reducer';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { getColorForProject } from '../services/create-project.service';

const { dialog } = window.require('electron').remote;

// TODO: Flow types
export default (store: any) => (next: any) => (action: any) => {
  // Pass all actions through
  next(action);

  switch (action.type) {
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
          if (getInternalProjectById(projectId, state)) {
            dialog.showErrorBox(
              'Project name already exists',
              "Egad! A project with that name already exists. To work around this limitation, you can change the 'name' field in the project's package.json file."
            );

            throw new Error('project-name-already-exists');
          }

          const type = inferProjectType(json);
          if (!type) {
            // Guppy only supports create-react-app and Gatsby projects atm.
            // Hopefully one day, arbitrary projects will have first-class
            // support... but for now, I'm prioritizing an A+ experience for
            // supported project types.
            dialog.showErrorBox(
              'Unsupported project type',
              "Looks like the project you're trying to import isn't supported. Unfortunately, Guppy only supports projects created with create-react-app or Gatsby"
            );

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
            },
          };

          return packageJsonWithGuppy;
        })
        .then(json => writePackageJson(path, json))
        .then(json => {
          next(importExistingProjectFinish(path, json));
        })
        .catch(err => {
          console.error(err);
          dialog.showErrorBox(
            'Invalid project',
            "Looks like the project you're trying to import isn't supported. Projects need to have a package.json in their root directory."
          );
        });

      break;
    }

    default: {
      return;
    }
  }
};

const inferProjectType = json => {
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
