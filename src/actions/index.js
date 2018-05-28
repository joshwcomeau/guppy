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
