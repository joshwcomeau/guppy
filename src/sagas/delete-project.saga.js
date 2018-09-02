// @flow
import { remote } from 'electron';
import { call, put, select, takeEvery } from 'redux-saga/effects';

import {
  SHOW_DELETE_PROJECT_PROMPT,
  finishDeletingProject,
  selectProject,
  createNewProjectStart,
} from '../actions';
import { getProjectsArray } from '../reducers/projects.reducer';

import type { Action } from 'redux';
import type { Saga } from 'redux-saga';
import type { Project } from '../types';

const { dialog, shell } = remote;

export const getNextProjectId = (
  projects: Array<Project>,
  idToDelete: string
) => {
  const projectIndex = projects.findIndex(project => project.id === idToDelete);

  if (projectIndex === -1) {
    throw new Error(
      "The project you're attempting to delete does not appear to exist within the known projects. We're not sure how this is possible :/"
    );
  }

  // If we're about to delete the last project in the list, there is no other
  // project to select.
  if (projects.length === 1) {
    return null;
  }

  // We want to select the next project in the list after the to-be-deleted one.
  // If the to-be-deleted project IS last in the list, select the one before.
  const isLastProjectBeingDeleted = projectIndex === projects.length - 1;

  const nextProject = isLastProjectBeingDeleted
    ? projects[projectIndex - 1]
    : projects[projectIndex + 1];

  return nextProject.id;
};

export function* deleteProject({ project }: Action): Saga<void> {
  // NOTE: we're using this form of `call` because it appears to work best
  // with Flow. Once https://github.com/joshwcomeau/guppy/pull/154 is merged,
  // we should try changing this to:
  //
  //  yield call(dialog.showMessageBox, {
  //
  // It may not work, but we should try and figure it out, since it's more
  // intuitive.
  const response = yield call([dialog, dialog.showMessageBox], {
    type: 'warning',
    buttons: ['Delete from Guppy', 'Delete from Disk', 'Cancel'],
    defaultId: 0,
    cancelId: 2,
    title: `Delete ${project.name}`,
    message: `Are you sure you want to delete ${project.name}?`,
    detail: `Deleting from Guppy will remove ${
      project.name
    } from the app, but doesn't remove it from your computer.\n\nIMPORTANT! Deleting from disk will send the project to trash!`,
  });

  const shouldDeleteFromDisk = response === 1;
  const cancel = response === 2;

  if (cancel) {
    return;
  }

  // Get a list of projects before deletion
  let projects = yield select(getProjectsArray);

  // Calculate which project should be selected after this project is deleted.
  const nextSelectedProjectId = getNextProjectId(projects, project.id);

  if (shouldDeleteFromDisk) {
    // Run the deletion from disk
    const successfullyDeletedFromDisk = yield call(
      [shell, shell.moveItemToTrash],
      project.path
    );

    // If for some reason it was _not_ successfully deleted, bail early and log
    // an error. This can happen if the filesystem can't delete it (maybe if
    // a file is open?)
    // TODO: Actually show something in the UI in this case.
    if (!successfullyDeletedFromDisk) {
      yield call(
        [console, console.error],
        'Project could not be deleted. Please make sure no tasks are running, ' +
          'and no applications are using files in that directory.'
      );
      return;
    }
  }

  // We need to remove this project from redux state, so that it's consistent
  // with the filesystem. This is done regardless if deleting from Guppy or
  // from disk.
  yield put(finishDeletingProject(project.id));

  // If there are any projects left, select the next one. Otherwise, it's
  // time for the user to create a new project!
  yield nextSelectedProjectId
    ? put(selectProject(nextSelectedProjectId))
    : put(createNewProjectStart());
}

export default function* rootSaga(): Saga<void> {
  yield takeEvery(SHOW_DELETE_PROJECT_PROMPT, deleteProject);
}
