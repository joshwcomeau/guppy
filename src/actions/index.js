// @flow
import readLocalProjectsFromDisk from '../services/read-local-projects.service';

import type { Project } from '../types';

//
//
// Action Types
// TODO: There has to be a way with Flow to ditch these right?
//
export const REFRESH_PROJECTS = 'REFRESH_PROJECTS';
export const START_CREATING_NEW_PROJECT = 'START_CREATING_NEW_PROJECT';
export const CANCEL_CREATING_NEW_PROJECT = 'CANCEL_CREATING_NEW_PROJECT';
export const FINISH_CREATING_NEW_PROJECT = 'FINISH_CREATING_NEW_PROJECT';
export const ADD_PROJECT = 'ADD_PROJECT';
export const HIDE_MODAL = 'HIDE_MODAL';
export const DISMISS_SIDEBAR_INTRO = 'DISMISS_SIDEBAR_INTRO';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const START_TASK = 'START_TASK';
export const ABORT_TASK = 'ABORT_TASK';
export const COMPLETE_TASK = 'COMPLETE_TASK';

//
//
// Action Creators
//
export const addProject = (project: Project) => ({
  type: ADD_PROJECT,
  project,
});

export const refreshProjects = () => {
  return (dispatch: any) => {
    readLocalProjectsFromDisk().then(projects =>
      dispatch({
        type: REFRESH_PROJECTS,
        projects,
      })
    );
  };
};

export const startCreatingNewProject = () => ({
  type: START_CREATING_NEW_PROJECT,
});

export const cancelCreatingNewProject = () => ({
  type: CANCEL_CREATING_NEW_PROJECT,
});

export const finishCreatingNewProject = () => ({
  type: FINISH_CREATING_NEW_PROJECT,
});

export const dismissSidebarIntro = () => ({
  type: DISMISS_SIDEBAR_INTRO,
});

export const selectProject = (projectId: string) => ({
  type: SELECT_PROJECT,
  projectId,
});

export const startTask = (
  projectId: string,
  taskId: string,
  timestamp: Date
) => ({
  type: START_TASK,
  projectId,
  taskId,
  timestamp,
});

export const abortTask = (
  projectId: string,
  taskId: string,
  timestamp: Date
) => ({
  type: ABORT_TASK,
  projectId,
  taskId,
  timestamp,
});

export const completeTask = (
  projectId: string,
  taskId: string,
  timestamp: Date
) => ({
  type: COMPLETE_TASK,
  projectId,
  taskId,
  timestamp,
});
