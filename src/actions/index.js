// @flow
import readLocalProjectsFromDisk from '../services/read-local-projects.service';

import type { Project } from '../types';

export const INITIALIZE = 'INITIALIZE';
export const REFRESH_PROJECTS = 'REFRESH_PROJECTS';

export const initialize = (projects: Array<Project>) => ({
  type: INITIALIZE,
  projects,
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
