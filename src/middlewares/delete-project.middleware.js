// @flow
import { remote } from 'electron';
import {
  SHOW_DELETE_PROJECT_PROMPT,
  DELETE_PROJECT_FROM_DISK,
  FINISH_DELETING_PROJECT_FROM_DISK,
  deleteProjectFromDisk,
  deleteProjectFromDiskFinish,
  refreshProjects,
  selectProject,
  createNewProjectStart,
} from '../actions';

const { dialog, shell } = remote;

export default (store: any) => (next: any) => (action: any) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case SHOW_DELETE_PROJECT_PROMPT: {
      dialog.showMessageBox(
        {
          type: 'warning',
          buttons: ['Delete from Disk', 'Cancel'],
          defaultId: 0,
          title: `Delete ${action.project.name}`,
          message: `Are you sure you want to delete ${action.project.name}?`,
          detail: 'WARNING! Deleting from disk will send the project to trash!',
        },
        (response: number) => {
          // TODO: Eventually need to do shouldDeleteFromGuppy as well
          const shouldDeleteFromDisk = response === 0;

          if (shouldDeleteFromDisk) {
            const { project } = action;
            store.dispatch(deleteProjectFromDisk(project));
          }
        }
      );
      break;
    }

    case DELETE_PROJECT_FROM_DISK: {
      const { path, id } = action.project;

      // Returns true if successfully deleted
      const successfullyDeleted = shell.moveItemToTrash(path);

      if (successfullyDeleted) {
        store.dispatch(deleteProjectFromDiskFinish(id));
      }
      break;
    }

    case FINISH_DELETING_PROJECT_FROM_DISK: {
      // Make sure we get an updated project list
      store.dispatch(refreshProjects());

      // Get the deleted project id from the action
      // so we know what is deleted
      const { deletedProjectId } = action;

      // Get the fresh projects list from state
      const { projects } = store.getState();

      // Calculate the remaining projects by filtering
      // out the deletedProjectId
      const remainingProjects = Object.keys(projects.byId).filter(
        id => id !== deletedProjectId
      );

      if (remainingProjects.length >= 1) {
        // If remainingProjects array has at least one project
        // there's a project to select
        const nextId = remainingProjects[0];
        store.dispatch(selectProject(nextId));
      } else {
        // Otherwise there are no more projects
        // so spit out to the new project screen
        store.dispatch(createNewProjectStart());
      }

      break;
    }
  }

  return next(action);
};
