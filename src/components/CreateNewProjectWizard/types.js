// @flow

export type Field =
  | 'projectName'
  | 'projectType'
  | 'projectIcon'
  | 'projectStarter';
export type BuildStep =
  | 'installingCliTool'
  | 'creatingProjectDirectory'
  | 'installingDependencies'
  | 'guppification';

export type Status = 'filling-in-form' | 'building-project' | 'project-created';

export type Step = Field | BuildStep;
