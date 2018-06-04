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

export type Task = {
  projectId: string,
  taskName: string,
  description: string,
  type: TaskType,
  processId: number,
  command: string,
  status: 'idle' | 'running' | 'error',
  // Destructive tasks, like create-react-app's "eject", should make it clear
  // in the UI that they are serious-business, not to be done lightly.
  isDestructiveTask: boolean,
  timeSinceStatusChange: Date,
  logs: Array<Log>,
};

type AppType = 'create-react-app' | 'gatsby';

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
    type: AppType,
    icon: string,
  },
};

export type Project = {
  // `id` here is equal to `name` in `ProjectInternal`
  id: string,
  // `name` is the friendly name, with full UTF-8 character access.
  name: string,
  type: AppType,
  icon: string,
  // `dependencies` is unchanged from `ProjectInternal`.
  dependencies: {
    [key: string]: string,
  },
  // `tasks` is a superset of `ProjectInternal.scripts`. Includes much more
  // info.
  tasks: Array<Task>,
};

export type TaskStatus = 'running' | 'idle' | 'error';
