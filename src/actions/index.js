// @flow
import readLocalProjectsFromDisk from '../services/read-local-projects.service';

import type { Project } from '../types';

export const INITIALIZE = 'INITIALIZE';
export const ADD_PROJECT = 'ADD_PROJECT';
export const REFRESH_PROJECTS = 'REFRESH_PROJECTS';
export const START_CREATING_NEW_PROJECT = 'START_CREATING_NEW_PROJECT';
export const HIDE_MODAL = 'HIDE_MODAL';

export const initialize = (projects: Array<Project>) => ({
  type: INITIALIZE,
  projects,
});

export const addProject = (project: Project) => ({
  type: ADD_PROJECT,
  project,
});

export const refreshProjects = (projects: Array<Project>) => {
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

export const hideModal = () => ({
  type: HIDE_MODAL,
});
