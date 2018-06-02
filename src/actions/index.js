// @flow
import readLocalProjectsFromDisk from '../services/read-local-projects.service';

import type { Project, Task } from '../types';

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
export const RUN_TASK = 'RUN_TASK';
export const ABORT_TASK = 'ABORT_TASK';
export const COMPLETE_TASK = 'COMPLETE_TASK';
export const RECEIVE_DATA_FROM_TASK_EXECUTION =
  'RECEIVE_DATA_FROM_TASK_EXECUTION';

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

export const runTask = (task: Task, timestamp: Date) => ({
  type: RUN_TASK,
  task,
  timestamp,
});

export const abortTask = (task: Task, timestamp: Date) => ({
  type: ABORT_TASK,
  task,
  timestamp,
});

export const completeTask = (task: Task, timestamp: Date) => ({
  type: COMPLETE_TASK,
  task,
  timestamp,
});

export const receiveDataFromTaskExecution = (task: Task, data: string) => ({
  type: RECEIVE_DATA_FROM_TASK_EXECUTION,
  task,
  data,
});
