// @flow
import produce from 'immer';
import {
  REFRESH_PROJECTS,
  ADD_PROJECT,
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

const buildUniqueTaskId = (projectId, taskName) => `${projectId}-${taskName}`;
const buildNewTask = (projectId, taskName, command) => ({
  projectId,
  taskName,
  command,
  status: 'idle',
  timeSinceStatusChange: null,
  logs: [],
});

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
      const { task, text, logId } = action;
      const { projectId, taskName } = task;

      const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

      return produce(state, draftState => {
        draftState[uniqueTaskId].logs.push({ id: logId, text });
      });
    }

    default:
      return state;
  }
};

//
//
//
// Selectors
type GlobalState = { tasks: State };

export const getTasksForProjectId = (projectId: string, state: GlobalState) =>
  // $FlowFixMe
  Object.values(state.tasks).filter(task => task.projectId === projectId);

export const getTaskByProjectIdAndTaskName = (
  projectId: string,
  taskName: string,
  state: GlobalState
) => {
  const uniqueTaskId = buildUniqueTaskId(projectId, taskName);

  return state.tasks[uniqueTaskId];
};
