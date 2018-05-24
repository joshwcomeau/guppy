import readLocalProjectsFromDisk from '../services/read-local-projects.service';

export const INITIALIZE = 'INITIALIZE';
export const REFRESH_PROJECTS = 'REFRESH_PROJECTS';

export const initialize = projects => ({
  type: INITIALIZE,
  projects,
});

export const refreshProjects = projects => {
  return dispatch => {
    readLocalProjectsFromDisk().then(projects =>
      dispatch({
        type: REFRESH_PROJECTS,
        projects,
      })
    );
  };
};
