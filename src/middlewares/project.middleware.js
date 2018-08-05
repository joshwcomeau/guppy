import slug from 'slug';
import {
  CHANGE_PROJECT_NAME,
  CHANGE_PROJECT_NAME_FINISHED,
  CHANGE_PROJECT_ICON,
  changeProjectNameFinished,
  refreshProjects,
  selectProject,
} from '../actions';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { getSelectedProject } from '../reducers/projects.reducer';

const fs = window.require('fs');
const path = window.require('path');
const { dialog } = window.require('electron').remote;

export default (store: any) => (next: any) => (action: any) => {
  switch (action.type) {
    case CHANGE_PROJECT_NAME:
      const state = store.getState();
      // console.log(
      //   'input needed - new name, project',
      //   action.name,
      //   getSelectedProject(state),
      //   state
      // );
      const project = getSelectedProject(state); // before change
      const { path: projectPath } = project;
      const id = slug(action.name).toLowerCase();

      // Let's load the basic project info for the path specified, if possible.
      loadPackageJson(projectPath)
        .then(json => {
          // const projectId = json.name;
          const { guppy } = json;

          // Check to see if we already have a project with this ID.
          // In the future, maybe I can attach a suffix like `-copy`, but for
          // now I'll just reject it outright.
          // if (getInternalProjectById(projectId, state)) {
          //   throw new Error('project-name-already-exists');
          // }
          const packageJsonWithGuppy = {
            ...json,
            name: id,
            guppy: {
              ...guppy,
              id,
              name: action.name,
            },
          };

          // Todo: Check if id is modified & only write if modified
          // Todo: Add prompt if this is an imported project

          return packageJsonWithGuppy;
        })
        .then(json => writePackageJson(projectPath, json))
        .then(json => {
          const workspace = path.resolve(projectPath, '../'); // we could use getDefaultParentPath from path.reducers as well - what's better?
          new Promise((resolve, reject) =>
            fs.rename(projectPath, path.join(workspace, id), err => {
              if (err) return reject(err);
              resolve();
            })
          )
            .then(() => {
              // renaming done
              //console.log('next finish', state, project); // info: project is the project before name change --> so create project with new naming
              store.dispatch(
                changeProjectNameFinished({
                  ...project,
                  id,
                  name: action.name,
                })
              );
            })
            .catch(err => {
              //console.log('renaming failed', err);
              throw Error('project-renaming-failed'); //todo check what error can occur e.g. write access error?
            });
        })
        .catch(err => {
          switch (err.message) {
            case 'project-renaming-failed': {
              dialog.showErrorBox(
                'Project renaming failed',
                "Egad! Check that you're having the permission to modify the project folder?"
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
        });
      break;
    case CHANGE_PROJECT_NAME_FINISHED:
      // todo: Why not dispatch directly in CHANGE_PROJECT_NAME?
      // todo: Check if refreshProjects is doing too much? It would be better to just refresh the modified project - for now OK.
      //// console.log('refresh now', action.project);
      const { id: projectId } = action.project;
      //// console.log('projectid', projectId);
      // store.dispatch(refreshProjects()); // --> throws an error Cannot read property 'name' of null at ProjectConfigurationModal.render
      // store.dispatch(selectProject(projectId)); // reselecting the same project with new id not working yet!!
      break;
    case CHANGE_PROJECT_ICON:
      break;

    default:
  }
  return next(action);
};
