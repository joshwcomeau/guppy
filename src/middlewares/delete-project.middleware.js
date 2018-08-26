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

import { getProjectsArray } from '../reducers/projects.reducer';

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
      const { project } = action;
      const { path } = project;

      // Returns true if successfully deleted
      const successfullyDeleted = shell.moveItemToTrash(path);

      if (successfullyDeleted) {
        store.dispatch(deleteProjectFromDiskFinish(project));
        store.dispatch(refreshProjects());
      }
      break;
    }

    case FINISH_DELETING_PROJECT_FROM_DISK: {
      // Get the deleted project from the action
      // so we know what was deleted
      const { deletedProject } = action;

      // Get a fresh projects array from state
      const projects = getProjectsArray(store.getState());

      // Calculate remaining projects by filtering out deletedProject.id
      const remainingProjects = projects.filter(
        project => project.id !== deletedProject.id
      );

      // If remainingProjects array has at least one project
      // then there's a project to select next
      if (remainingProjects.length >= 1) {
        const nextProject = remainingProjects[0];
        store.dispatch(selectProject(nextProject.id));
      } else {
        // Otherwise there are no more projects left
        // so just render the create/import screen
        store.dispatch(createNewProjectStart());
      }
      break;
    }
  }

  return next(action);
};
