// @flow

export type Field = 'projectName' | 'projectType' | 'projectIcon';
export type BuildStep =
  | 'creatingParentDirectory'
  | 'installingCliTool'
  | 'creatingProjectDirectory'
  | 'installingDependencies'
  | 'guppification';

export type Status = 'filling-in-form' | 'building-project' | 'project-created';

export type Step = Field | BuildStep;
