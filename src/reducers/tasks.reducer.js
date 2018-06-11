// @flow
/**
 * NOTE: I built this reducer trying to think of it as a database model.
 * Each task has a unique ID, and is a child of a project.
 *
 * In practice, it's felt like a lot of trouble to keep this "flat" table
 * of entities.
 *
 * When it came time to do the same thing for dependencies, I decided to go
 * with a "nested" structure, where the top-level keys of the `dependencies`
 * reducer are all project IDs, and it holds a simple map of the dependencies
 * for that project
 *
 * It felt much simpler and easier to work with, so I should probably update
 * this reducer to match that reducer's style. Right now they're inconsistent
 * and that's bad.
 */
import produce from 'immer';
import {
  REFRESH_PROJECTS,
  ADD_PROJECT,
  LAUNCH_DEV_SERVER,
  RUN_TASK,
  ABORT_TASK,
  COMPLETE_TASK,
  ATTACH_PROCESS_ID_TO_TASK,
  RECEIVE_DATA_FROM_TASK_EXECUTION,
} from '../actions';

import type { Action } from 'redux';
import type { Project, Task } from '../types';

type State = {
  [uniqueTaskId: string]: Task,
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case REFRESH_PROJECTS: {
      return produce(state, draftState => {
        Object.keys(action.projects).forEach(projectId => {
          const project = action.projects[projectId];

          Object.keys(project.scripts).forEach(name => {
            const command = project.scripts[name];

            const uniqueTaskId = buildUniqueTaskId(projectId, name);

            // If this task already exists, we need to be careful.
            //
            // This action is called when we want to read from the disk, and
            // it's possible that the user has manually edited the package.json.
            // We want to update the task command.
            //
            // But! We also store a bunch of metadata in this reducer, like
            // the log history, and the `timeSinceStatusChange`. So we don't
            // want to overwrite it, we want to merge it.
            if (draftState[uniqueTaskId]) {
              draftState[uniqueTaskId].command = command;
              return;
            }

            draftState[uniqueTaskId] = buildNewTask(
              uniqueTaskId,
              projectId,
              name,
              command
            );
          });
        });
      });
    }

    case ADD_PROJECT: {
      const { project } = action;

      const projectId = project.guppy.id;

      return produce(state, draftState => {
        Object.keys(project.scripts).forEach(name => {
          const command = project.scripts[name];

          const uniqueTaskId = buildUniqueTaskId(projectId, name);

          draftState[uniqueTaskId] = buildNewTask(
            uniqueTaskId,
            projectId,
            name,
            command
          );
        });
      });
    }

    case LAUNCH_DEV_SERVER:
    case RUN_TASK: {
      const { task, timestamp } = action;

      return produce(state, draftState => {
        // If this is a long-running task, it's considered successful as long
        // as it doesn't have an failed.
        // For periodic tasks, though, this is a 'pending' state.
        const nextStatus = task.type === 'short-term' ? 'pending' : 'success';

        draftState[task.id].status = nextStatus;
        draftState[task.id].timeSinceStatusChange = timestamp;
      });
    }

    case ABORT_TASK: {
      const { task, timestamp } = action;

      return produce(state, draftState => {
        draftState[task.id].status = 'idle';
        draftState[task.id].timeSinceStatusChange = timestamp;
        delete draftState[task.id].processId;
      });
    }

    case COMPLETE_TASK: {
      const { task, timestamp, wasSuccessful } = action;

      return produce(state, draftState => {
        const nextStatus = !wasSuccessful
          ? 'failed'
          : task.type === 'short-term'
            ? 'success'
            : 'idle';

        draftState[task.id].status = nextStatus;
        draftState[task.id].timeSinceStatusChange = timestamp;
        delete draftState[task.id].processId;
      });
    }

    case ATTACH_PROCESS_ID_TO_TASK: {
      const { task, processId } = action;

      return produce(state, draftState => {
        draftState[task.id].processId = processId;
      });
    }

    case RECEIVE_DATA_FROM_TASK_EXECUTION: {
      const { task, text, isError, logId } = action;

      return produce(state, draftState => {
        draftState[task.id].logs.push({ id: logId, text });

        // Either set or reset a failed status, based on the data received.
        const nextStatus = isError
          ? 'failed'
          : task.type === 'short-term'
            ? 'pending'
            : 'success';

        draftState[task.id].status = nextStatus;
      });
    }

    default:
      return state;
  }
};

//
//
//
// Helpers
const buildUniqueTaskId = (projectId, name) => `${projectId}-${name}`;

const getTaskDescription = name => {
  switch (name) {
    case 'start': {
      return 'Run a local development server';
    }
    case 'build': {
      return 'Bundle your project for production';
    }
    case 'test': {
      return 'Run the automated tests';
    }
    case 'eject': {
      return 'Permanently reveal the create-react-app configuration files';
    }
    default: {
      return '';
    }
  }
};

const isDevServerTask = name =>
  // Gatsby and create-react-app use different names for the same task.
  // TODO: Maybe I should rename `develop` to `start` in Gatsby projects?
  name === 'start' || name === 'develop';

const getTaskType = name => {
  // We have two kinds of tasks:
  // - long-running tasks, like the dev server
  // - short-term tasks, like building for production.
  //
  // The distinction is important because the expectations are different.
  // For a dev server, "running" is a successful status - it means there are
  // no errors - while for a short-term task, "running" is essentially the same
  // as "loading", it's a yellow-light kind of thing.
  const sustainedTasks = ['start', 'develop'];

  return sustainedTasks.includes(name) ? 'sustained' : 'short-term';
};

// TODO: A lot of this stuff shouldn't be done here :/ maybe best to resolve
// this in an action before it hits the reducer?
const buildNewTask = (
  id: string,
  projectId: string,
  name: string,
  command: string
): Task => ({
  id,
  name,
  projectId,
  command,
  description: getTaskDescription(name),
  type: getTaskType(name),
  status: 'idle',
  timeSinceStatusChange: null,
  logs: [],
});

//
//
//
// Selectors
type GlobalState = { tasks: State };

export const getTaskById = (taskId: string, state: GlobalState) =>
  state.tasks[taskId];

export const getTasksForProjectId = (
  projectId: string,
  state: any
): Array<Task> =>
  Object.keys(state.tasks)
    .map(taskId => state.tasks[taskId])
    .filter(task => task.projectId === projectId);

export const getTasksInTaskListForProjectId = (
  projectId: string,
  state: GlobalState
) =>
  getTasksForProjectId(projectId, state).filter(
    task => !isDevServerTask(task.name)
  );

export const getDevServerTaskForProjectId = (
  projectId: string,
  state: GlobalState
) =>
  state.tasks[buildUniqueTaskId(projectId, 'start')] ||
  state.tasks[buildUniqueTaskId(projectId, 'develop')];

export const getTaskByProjectIdAndTaskName = (
  projectId: string,
  name: string,
  state: GlobalState
) => {
  const uniqueTaskId = buildUniqueTaskId(projectId, name);

  return state.tasks[uniqueTaskId];
};
