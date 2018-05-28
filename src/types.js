export type ProjectType = 'create-react-app' | 'gatsby';

export type SubmittedProject = {
  projectName: string,
  projectType: ProjectType,
  projectIcon: string,
};

// TODO: Add types for existing projects, held in Redux
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
