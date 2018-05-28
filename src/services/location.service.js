// @flow

// TODO: Figure out how to use flow-typed, so I can use ReactRouter definitions!
type Location = {
  pathname: string,
};

export const extractProjectIdFromUrl = (location: Location) => {
  const regexMatch = location.pathname.match(/\/project\/([\w\-]+)/i);

  if (!regexMatch) {
    return null;
  }

  const [matchStr, projectId] = regexMatch;

  return projectId;
};

export const buildUrlForProjectId = (projectId: string) =>
  `/project/${projectId}`;
