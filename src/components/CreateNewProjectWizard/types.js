// @flow

export type Field = 'projectName' | 'projectType' | 'projectIcon';
export type Step = Field | 'done';

export type ProjectType = 'create-react-app' | 'gatsby';

export type SubmittedProject = {
  projectName: string,
  projectType: ProjectType,
  projectIcon: string,
};
