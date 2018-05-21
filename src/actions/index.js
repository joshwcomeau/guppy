import slug from 'slug';

export const CREATE_PROJECT_START = 'CREATE_PROJECT_START';
export const CREATE_PROJECT_UPDATE_STATUS = 'CREATE_PROJECT_UPDATE_STATUS';
export const CREATE_PROJECT_FINISH = 'CREATE_PROJECT_FINISH';

export const createProjectStart = ({ name, type }) => ({
  type: CREATE_PROJECT_START,
  id: slug(name),
  name,
  type,
});

export const createProjectUpdateStatus = ({ id, metadata }) => ({
  type: CREATE_PROJECT_UPDATE_STATUS,
});
