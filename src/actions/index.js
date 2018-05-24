export const INITIALIZE = 'INITIALIZE';
export const REFRESH_PROJECTS = 'REFRESH_PROJECTS';

export const initialize = projects => ({
  type: INITIALIZE,
  projects,
});

export const refreshProjects = projects => ({
  type: REFRESH_PROJECTS,
  projects,
});
