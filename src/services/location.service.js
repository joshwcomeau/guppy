// @flow

// TODO: Figure out how to use flow-typed, so I can use ReactRouter definitions!
type Location = {
  pathname: string,
};

export const extractProjectIdFromUrl = (location: Location) => {
  const regexMatch = location.pathname.match(/\/project\/([\w-]+)/i);

  if (!regexMatch) {
    return null;
  }

  const [, projectId] = regexMatch;

  return projectId;
};

export const extractProjectTabFromUrl = (location: Location) => {
  // Match the entire url, to guard against false-positive matches from other
  // URLs.
  const regexMatch = location.pathname.match(/\/project\/[\w-]+\/([\w]+)/i);

  if (!regexMatch) {
    return null;
  }

  const [, projectTab] = regexMatch;

  return projectTab;
};

export const extractSelectedTaskFromUrl = (location: Location) => {
  // Match the entire url, to guard against false-positive matches from other
  // URLs.
  const regexMatch = location.pathname.match(/\/tasks\/([\w]+)/i);

  if (!regexMatch) {
    return null;
  }

  const [, task] = regexMatch;

  return task;
};
