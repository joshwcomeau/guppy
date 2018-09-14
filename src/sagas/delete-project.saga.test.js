import electron from 'electron'; // Mocked
import { call, put, select, takeEvery } from 'redux-saga/effects';

import {
  SHOW_DELETE_PROJECT_PROMPT,
  finishDeletingProject,
  selectProject,
  createNewProjectStart,
} from '../actions';
import { getProjectsArray } from '../reducers/projects.reducer';
import { createProject } from '../services/test-factories.service';
import rootSaga, {
  deleteProject,
  getNextProjectId,
} from './delete-project.saga';

describe('delete-project saga', () => {
  describe('root delete-project saga', () => {
    it('should watch for start actions', () => {
      const saga = rootSaga();
      expect(saga.next().value).toEqual(
        takeEvery(SHOW_DELETE_PROJECT_PROMPT, deleteProject)
      );
    });
  });

  describe('deleteProject', () => {
    it('deletes a specified project from disk', () => {
      const projectA = createProject({
        id: 'a',
        name: 'apple',
        path: '/path/to/apple',
      });
      const projectB = createProject({
        id: 'b',
        name: 'berry',
        path: '/path/to/berry',
      });

      const projects = [projectA, projectB];

      const saga = deleteProject({ project: projectA });

      expect(saga.next().value).toEqual(
        call([electron.remote.dialog, electron.remote.dialog.showMessageBox], {
          type: 'warning',
          buttons: ['Delete from Guppy', 'Delete from Disk', 'Cancel'],
          defaultId: 0,
          cancelId: 2,
          title: `Delete ${projectA.name}`,
          message: `Are you sure you want to delete ${projectA.name}?`,
          detail: `Deleting from Guppy will remove ${
            projectA.name
          } from the app, but doesn't remove it from your computer.\n\nIMPORTANT! Deleting from disk will send the project to trash!`,
        })
      );

      // Next, we select the projects, passing in `1` to confirm the prompt
      // (`0` is the ID of the "Delete from Disk" option).
      expect(saga.next(1).value).toEqual(select(getProjectsArray));

      expect(saga.next(projects).value).toEqual(
        call(
          [electron.remote.shell, electron.remote.shell.moveItemToTrash],
          projectA.path
        )
      );

      expect(saga.next(true).value).toEqual(
        put(finishDeletingProject(projectA.id))
      );

      // Because there's another project, it should select the next one.
      expect(saga.next().value).toEqual(put(selectProject('b')));
      expect(saga.next().done).toEqual(true);
    });

    it('deletes a specified project from guppy', () => {
      const projectA = createProject({
        id: 'a',
        name: 'apple',
        path: '/path/to/apple',
      });

      const projectB = createProject({
        id: 'b',
        name: 'berry',
        path: '/path/to/berry',
      });

      const projects = [projectA, projectB];

      const saga = deleteProject({ project: projectA });

      expect(saga.next().value).toEqual(
        call([electron.remote.dialog, electron.remote.dialog.showMessageBox], {
          type: 'warning',
          buttons: ['Delete from Guppy', 'Delete from Disk', 'Cancel'],
          defaultId: 0,
          cancelId: 2,
          title: `Delete ${projectA.name}`,
          message: `Are you sure you want to delete ${projectA.name}?`,
          detail: `Deleting from Guppy will remove ${
            projectA.name
          } from the app, but doesn't remove it from your computer.\n\nIMPORTANT! Deleting from disk will send the project to trash!`,
        })
      );

      // Next, we select the projects, passing in `0` to confirm the prompt
      // (`0` is the ID of the "Delete from Guppy" option).
      expect(saga.next(0).value).toEqual(select(getProjectsArray));

      // We are not deleting anything from disk so we simply move on to refresh state
      expect(saga.next(projects).value).toEqual(
        put(finishDeletingProject(projectA.id))
      );

      // Because there's another project, it should select the next one.
      expect(saga.next().value).toEqual(put(selectProject('b')));
      expect(saga.next().done).toEqual(true);
    });

    it('prompts the user to create a new project, when deleting the final project', () => {
      const project = createProject({
        id: 'a',
        name: 'apple',
        path: '/path/to/apple',
      });

      const projects = [project];

      const saga = deleteProject({ project });

      // Show dialog
      saga.next();
      // Confirm dialog
      saga.next(0);
      // Pass in the projects to the select call
      saga.next(projects);

      // Confirm deletion and verify that it prompts to create a new project
      expect(saga.next(true).value).toEqual(put(createNewProjectStart()));
      expect(saga.next().done).toEqual(true);
    });

    it("logs an error when the project can't be deleted", () => {
      const project = createProject({
        id: 'a',
        name: 'apple',
        path: '/path/to/apple',
      });

      const projects = [
        project,
        createProject({ id: 'b', name: 'berry', path: '/path/to/berry' }),
      ];

      const saga = deleteProject({ project });

      // Show dialog
      saga.next();
      // Confirm dialog
      saga.next(1);
      // Pass in the projects to the select call
      saga.next(projects);

      // Return `false` to `successfullyDeleted`
      expect(saga.next(false).value).toEqual(
        call(
          [console, console.error],
          'Project could not be deleted. Please make sure no tasks are running, ' +
            'and no applications are using files in that directory.'
        )
      );

      // Ensure it bails early
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('getNextProjectId', () => {
    it('gets the next project', () => {
      const projects = [
        createProject({ id: 'a' }),
        createProject({ id: 'b' }),
        createProject({ id: 'c' }),
      ];
      const idToDelete = 'b';

      expect(getNextProjectId(projects, idToDelete)).toEqual('c');
    });

    it('gets the previous project, when deleting the last one', () => {
      const projects = [
        createProject({ id: 'a' }),
        createProject({ id: 'b' }),
        createProject({ id: 'c' }),
      ];
      const idToDelete = 'c';

      expect(getNextProjectId(projects, idToDelete)).toEqual('b');
    });

    it('returns null if there are no more projects to select', () => {
      const projects = [createProject({ id: 'a' })];
      const idToDelete = 'a';

      expect(getNextProjectId(projects, idToDelete)).toEqual(null);
    });

    it('throws an error if the project cannot be found', () => {
      const projects = [
        createProject({ id: 'a' }),
        createProject({ id: 'b' }),
        createProject({ id: 'c' }),
      ];
      const idToDelete = 'd';

      expect(() => getNextProjectId(projects, idToDelete)).toThrow();
    });
  });
});
