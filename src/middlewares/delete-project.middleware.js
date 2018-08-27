// @flow
import { remote } from 'electron';

import {
  SHOW_DELETE_PROJECT_PROMPT,
  finishDeletingProjectFromDisk,
  selectProject,
  createNewProjectStart,
} from '../actions';

import { getProjectsArray } from '../reducers/projects.reducer';

const { dialog, shell } = remote;

export default (store: any) => (next: any) => (action: any) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case SHOW_DELETE_PROJECT_PROMPT: {
      const { name, path, id: deletedId } = action.project;

      dialog.showMessageBox(
        {
          type: 'warning',
          buttons: ['Delete from Disk', 'Cancel'],
          defaultId: 0,
          title: `Delete ${name}`,
          message: `Are you sure you want to delete ${name}?`,
          detail: 'WARNING! Deleting from disk will send the project to trash!',
        },
        (response: number) => {
          // TODO: Eventually need to do shouldDeleteFromGuppy as well
          const shouldDeleteFromDisk = response === 0;

          if (!shouldDeleteFromDisk) {
            return;
          }

          // Get a list of projects before deletion
          const projects = getProjectsArray(store.getState());

          // Get the position of the deleted project
          const index = projects.map(project => project.id).indexOf(deletedId);

          // Run the deletion
          const successfullyDeleted = shell.moveItemToTrash(path);

          if (successfullyDeleted) {
            // Update state
            store.dispatch(finishDeletingProjectFromDisk(deletedId));
          }

          // Calculate remaining projects by filtering out the deleted project
          const remainingProjects = projects.filter(
            project => project.id !== action.project.id
          );

          // Get the index for the next project
          // It's either the next project after deleted project's position
          // or if deleted project was last, then select the new last element
          const nextIndex =
            index < remainingProjects.length
              ? index
              : remainingProjects.length - 1;

          // If remainingProjects array has at least one project
          // then there's a project to select next
          if (remainingProjects.length >= 1) {
            // Select the next project
            const nextProject = remainingProjects[nextIndex];
            store.dispatch(selectProject(nextProject.id));
          } else {
            // Otherwise there are no more projects left
            // so just render the create/import screen
            store.dispatch(createNewProjectStart());
          }
        }
      );
      break;
    }
  }

  return next(action);
};
