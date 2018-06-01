export type ProjectType = 'create-react-app' | 'gatsby';

export type SubmittedProject = {
  projectName: string,
  projectType: ProjectType,
  projectIcon: string,
};

export type Project = {
  name: string,
  dependencies: {
    [key: string]: string,
  },
  scripts: {
    [key: string]: string,
  },
  guppy: {
    name: string,
    icon: string,
  },
};

// TODO: Find a better way to use Flow and Redux together :/
export type Action = {
  type: string,
  [key: string]: any,
};

export type TaskStatus = 'running' | 'idle' | 'error';
