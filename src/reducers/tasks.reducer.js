// @flow
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
import type { Task } from '../types';

type State = {
  [uniqueTaskId: string]: Task,
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case REFRESH_PROJECTS: {
      return produce(state, draftState => {
        Object.values(action.projects).forEach(project => {
          const projectId = project.guppy.id;

          Object.entries(project.scripts).forEach(([taskName, command]) => {
            const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

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
              projectId,
              taskName,
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
        Object.entries(project.scripts).forEach(([taskName, command]) => {
          const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

          draftState[uniqueTaskId] = buildNewTask(projectId, taskName, command);
        });
      });
    }

    case LAUNCH_DEV_SERVER:
    case RUN_TASK: {
      const { task, timestamp } = action;
      const { projectId, taskName } = task;

      const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

      return produce(state, draftState => {
        draftState[uniqueTaskId].status = 'running';
        draftState[uniqueTaskId].timeSinceStatusChange = timestamp;
      });
    }

    case ABORT_TASK:
    case COMPLETE_TASK: {
      const { task, timestamp } = action;
      const { projectId, taskName } = task;

      const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

      return produce(state, draftState => {
        draftState[uniqueTaskId].status = 'idle';
        draftState[uniqueTaskId].timeSinceStatusChange = timestamp;
        delete draftState[uniqueTaskId].processId;
      });
    }

    case ATTACH_PROCESS_ID_TO_TASK: {
      const { task, processId } = action;
      const { projectId, taskName } = task;

      const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

      return produce(state, draftState => {
        draftState[uniqueTaskId].processId = processId;
      });
    }

    case RECEIVE_DATA_FROM_TASK_EXECUTION: {
      const { task, text, status, logId } = action;
      const { projectId, taskName } = task;

      const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

      return produce(state, draftState => {
        draftState[uniqueTaskId].logs.push({ id: logId, text });

        if (status) {
          draftState[uniqueTaskId].status = status;
        }
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
const buildUniqueTaskId = (projectId, taskName) => `${projectId}-${taskName}`;

const getTaskDescription = taskName => {
  switch (taskName) {
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
  }
};

const isDevServerTask = taskName =>
  // Gatsby and create-react-app use different names for the same task.
  // TODO: Maybe I should rename `develop` to `start` in Gatsby projects?
  taskName === 'start' || taskName === 'develop';

const getTaskType = taskName => {
  // We have two kinds of tasks:
  // - long-running tasks, like the dev server
  // - short-term tasks, like building for production.
  //
  // The distinction is important because the expectations are different.
  // For a dev server, "running" is a successful status - it means there are
  // no errors - while for a short-term task, "running" is essentially the same
  // as "loading", it's a yellow-light kind of thing.
  //
  // TODO: Gatsby tests are not long-running :/
  const sustainedTasks = ['start', 'develop', 'test'];

  return sustainedTasks.includes(taskName) ? 'sustained' : 'short-term';
};

const buildNewTask = (projectId, taskName, command) => ({
  projectId,
  command,
  taskName,
  description: getTaskDescription(taskName),
  type: getTaskType(taskName),
  status: 'idle',
  // TODO: Finer control over `isDestructiveTask`
  isDestructiveTask: taskName === 'eject',
  timeSinceStatusChange: null,
  logs: [],
});

//
//
//
// Selectors
type GlobalState = { tasks: State };

export const getTasksForProjectId = (
  projectId: string,
  state: GlobalState
): Array<Task> =>
  Object.keys(state.tasks)
    .map(taskId => state.tasks[taskId])
    .filter(task => task.projectId === projectId);

export const getTasksInTaskListForProjectId = (
  projectId: string,
  state: GlobalState
) =>
  getTasksForProjectId(projectId, state).filter(
    task => !isDevServerTask(task.taskName)
  );

export const getTaskByProjectIdAndTaskName = (
  projectId: string,
  taskName: string,
  state: GlobalState
) => {
  const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

  return state.tasks[uniqueTaskId];
};
