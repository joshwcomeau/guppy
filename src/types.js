// @flow
export type ProjectType = 'create-react-app' | 'gatsby' | 'nextjs';

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
export type DependencyStatus =
  | 'idle'
  | 'queued-install'
  | 'queued-update'
  | 'queued-delete'
  | 'installing'
  | 'updating'
  | 'deleting';
export type DependencyLocation = 'dependencies' | 'devDependencies';
export type QueueAction = 'install' | 'uninstall';
export type QueuedDependency = {
  name: string,
  version?: string,
  updating?: boolean,
};

export type Task = {
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

export type Repository = {
  type: string,
  url: string,
};

export type Dependency = {
  name: string,
  description: string,
  keywords?: Array<string>,
  version: string,
  homepage: string,
  license: string,
  repository: Repository,
  // All of the above fields are straight from the dependency's package.json.
  // The following two are derived values:
  // `status` is used to show loading indicators while performing actions on the dependency
  status: DependencyStatus,
  // `location` refers to where the dependency lives in the host project
  location: DependencyLocation,
};

/**
 * ProjectInternal is the behind-the-scenes type used in projects.reducer.
 * This is a copy of the project's package.json (which means it may have many
 * more fields, but these are the only ones I care about).
 */
export type ProjectInternal = {
  // This is the project's lowercase, slugified name. Eg. "hello-world"
  name: string,
  dependencies: {
    [key: string]: string,
  },
  scripts: {
    [key: string]: string,
  },
  guppy: {
    // A unique UUID for this project.
    // On legacy projects (created in 0.2 and earlier), this `id` will be
    // equal to the project's `name` (the top-level slug one in package.json)
    id: string,
    // This is the project's full UTF-8 name. Eg. "Hello world!"
    name: string,
    type: ProjectType,
    color: string,
    icon: string,
    createdAt: number,
  },
};

/**
 * While the `ProjectInternal` type above is just a representation of the
 * project's package.json, we also have a `Project` type. This type is meant
 * to be used within the React app, and wraps up a number of reducers:
 *
 * - tasks from tasks.reducer
 * - dependencies from dependencies.reducer
 * - project path on disk from path.reducer
 *
 * It also provides a limited subset of the `ProjectInternal` type, to abstract
 * away some of the peculiarities (such as the difference between project.name
 * and project.guppy.name).
 */
export type Project = {
  // `id` here is equal to `guppy.id` in `ProjectInternal`
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

export type ProjectInternalsMap = { [id: string]: ProjectInternal };

export type AppSettings = {
  general: {
    defaultProjectPath: string,
    defaultProjectType: ProjectType,
  },
  privacy: {
    enableUsageTracking: boolean,
  },
};
