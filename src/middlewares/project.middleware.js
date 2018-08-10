import slug from 'slug';
import {
  SAVE_PROJECT_SETTINGS_START,
  SAVE_PROJECT_SETTINGS_FINISH,
  REFRESH_PROJECTS,
  saveProjectSettingsFinish,
  refreshProjects,
  hideModal,
  // selectProject,
} from '../actions';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';
import { getSelectedProject } from '../reducers/projects.reducer';

const fs = window.require('fs');
const path = window.require('path');
const { dialog } = window.require('electron').remote;

const showConfirmation = () => {
  return new Promise((resolve, reject) =>
    dialog.showMessageBox(
      {
        type: 'warning',
        buttons: ['Yeah', 'Nope'],
        defaultId: 1,
        title: 'Are you sure?',
        message: 'Do you also want to rename the project folder?',
      },
      (response: number) => {
        // The response will be the index of the chosen option, from the
        // `buttons` array above.
        resolve(response === 0);
      }
    )
  );
};

export default (store: any) => (next: any) => (action: any) => {
  switch (action.type) {
    case SAVE_PROJECT_SETTINGS_START:
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
      const workspace = path.resolve(projectPath, '../'); // we could use getDefaultParentPath from path.reducers as well - what's better?
      let newPath = path.join(workspace, id);

      const renameFolder = (projectPath, newPath) =>
        new Promise((resolve, reject) => {
          fs.rename(projectPath, newPath, err => {
            if (err) return reject(err);
            resolve();
          });
        });

      //console.log('changed', projectPath !== newPath, projectPath, newPath);
      // Let's load the basic project info for the path specified, if possible.
      loadPackageJson(projectPath)
        .then(json =>
          (json.guppy.isImported && projectPath !== newPath
            ? showConfirmation() // only for imported projects & path changed
            : Promise.resolve(true)
          ).then(confirmed => [json, confirmed])
        )
        .then(([json, confirmed]) => {
          // const projectId = json.name;
          const { guppy } = json;
          const { id: oldProjectId } = guppy;
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
              icon: action.icon || guppy.icon,
              name: action.name,
            },
          };

          // Todo: Check if id is modified & only write if modified
          // Todo: Add prompt if this is an imported project

          return { json: packageJsonWithGuppy, confirmed, oldProjectId };
        })
        .then(({ json, confirmed, oldProjectId }) => {
          newPath = !confirmed ? projectPath : newPath;
          const renamePromise =
            confirmed && projectPath !== newPath
              ? renameFolder(projectPath, newPath)
              : Promise.resolve(); // confirmed & rename required

          return renamePromise
            .then(() => {
              // renaming done
              const update = { id, icon: json.guppy.icon, name: action.name };

              // console.log('next finish', state, {
              //   ...project,
              //   ...update,
              //   path: newPath,
              //   guppy: {
              //     ...project.guppy,
              //     ...update,
              //   },
              // }); // info: project is the project before name change --> so create project with new naming
              store.dispatch(
                saveProjectSettingsFinish(
                  {
                    ...project,
                    ...update,
                    path: newPath,
                    guppy: { ...project.guppy, ...update, type: project.type },
                  },
                  oldProjectId
                )
              );
              return { ...json, path: newPath };
            })
            .catch(err => {
              console.log('renaming failed', err);
              throw Error('project-renaming-failed'); //todo check what error can occur e.g. write access error?
            });
        })
        .then(json => writePackageJson(json.path, json)) // changed order so we can change path if needed
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
    case SAVE_PROJECT_SETTINGS_FINISH: // --> handled in projects reducer & sets curProjectId to new id
      // todo: Why not dispatch directly in CHANGE_PROJECT_NAME?
      // todo: Check if refreshProjects is doing too much? It would be better to just refresh the modified project - for now OK.
      //// console.log('refresh now', action.project);
      const { id: projectId } = action.project;
      //// console.log('projectid', projectId);
      store.dispatch(refreshProjects()); // --> throws an error Cannot read property 'name' of null at ProjectConfigurationModal.render
      // store.dispatch(selectProject(projectId)); // reselecting the same project with new id not working yet!!
      break;
    case REFRESH_PROJECTS:
      store.dispatch(hideModal());
      break;
    default:
  }
  return next(action);
};
