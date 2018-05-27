// @flow

export type ProjectType = 'create-react-app' | 'gatsby';

export type SubmittedProject = {
  projectName: string,
  projectType: ProjectType,
  projectIcon: string,
};

export type Field = 'projectName' | 'projectType' | 'projectIcon';
export type BuildStep =
  | 'initializing'
  | 'creatingParentDirectory'
  | 'installingCliTool'
  | 'creatingProjectDirectory'
  | 'installingDependencies';

export type Status = 'filling-in-form' | 'building-project' | 'project-created';

export type Step = Field | BuildStep;
