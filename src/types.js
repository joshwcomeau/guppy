// @flow
export type ProjectType = 'create-react-app' | 'gatsby';

export type SubmittedProject = {
  projectName: string,
  projectType: ProjectType,
  projectIcon: string,
};

export type Log = {
  text: string,
  id: string,
};

// TODO: Better names:
export type TaskType = 'short-term' | 'sustained';

export type TaskStatus = 'idle' | 'pending' | 'success' | 'failed';
export type DependencyStatus = 'idle' | 'installing' | 'updating' | 'deleting';

export type Task = {
  id: string,
  projectId: string,
  name: string,
  description: string,
  type: TaskType,
  status: TaskStatus,
  processId?: number,
  port?: number,
  command: string,
  timeSinceStatusChange: ?Date,
  logs: Array<Log>,
};

export type Dependency = {
  name: string,
  description: string,
  keywords?: Array<string>,
  version: string,
  homepage: string,
  license: string,
  repository: string,
  // All of the above fields are straight from the dependency's package.json.
  // The status field is separate, and used to show loading indicators while
  // performing actions on the dependency.
  status: DependencyStatus,
};

/**
 * ProjectInternal is the behind-the-scenes type used in projects.reducer.
 * This is a copy of the project's package.json (which means it may have many
 * more fields, but these are the only ones I care about).
 */
export type ProjectInternal = {
  // NOTE: this `name` is the same as `guppy.id`. It's the actual name of the
  // project, in package.json.
  // The reason for this confusing discrepancy is that NPM package names are
  // lowercase-and-dash only, whereas I want Guppy projects to be able to use
  // any UTF-8 characters.
  name: string,
  dependencies: {
    [key: string]: string,
  },
  scripts: {
    [key: string]: string,
  },
  guppy: {
    id: string,
    name: string,
    type: ProjectType,
    color: string,
    icon: string,
    createdAt: number,
  },
};

export type Project = {
  // `id` here is equal to `name` in `ProjectInternal`
  id: string,
  // `name` is the friendly name, with full UTF-8 character access.
  name: string,
  type: ProjectType,
  icon: string,
  color: string,
  createdAt: number,
  // `dependencies` is a "souped-up" version of the internal copy, with some
  // additional fields, like description, homepage, repository...
  // It also holds the specific version number used, not just an acceptable
  // version range.
  dependencies: Array<Dependency>,
  // `tasks` is a superset of `ProjectInternal.scripts`. Includes much more
  // info.
  tasks: Array<Task>,
  // `path` is the project's on-disk location.
  path: string,
};
