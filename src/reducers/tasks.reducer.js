import produce from 'immer';
import {
  REFRESH_PROJECTS,
  ADD_PROJECT,
  START_TASK,
  ABORT_TASK,
  COMPLETE_TASK,
} from '../actions';

import type { Action } from 'redux';

// @flow

type State = {
  [uniqueTaskId: string]: {
    projectId: string,
    taskId: string,
    taskCommand: string,
    status: 'idle' | 'running',
    timeSinceStatusChange: Date,
    logs: string,
  },
};

const initialState = {};

const buildUniqueTaskId = (projectId, taskId) => `${projectId}-${taskId}`;
const buildNewTask = (projectId, taskId, taskCommand) => ({
  projectId,
  taskId,
  taskCommand,
  status: 'idle',
  timeSinceStatusChange: null,
  logs: null,
});

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case REFRESH_PROJECTS: {
      return produce(state, draftState => {
        Object.values(action.projects).forEach(project => {
          const projectId = project.guppy.id;

          Object.entries(project.scripts).forEach(([taskId, taskCommand]) => {
            const uniqueTaskId = buildUniqueTaskId(projectId, taskId);

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
              draftState[uniqueTaskId].taskCommand = taskCommand;
              return;
            }

            draftState[uniqueTaskId] = buildNewTask(
              projectId,
              taskId,
              taskCommand
            );
          });
        });
      });
    }

    case ADD_PROJECT: {
      const { project } = action;

      const projectId = project.guppy.id;

      return produce(state, draftState => {
        Object.entries(project.scripts).forEach(([taskId, taskCommand]) => {
          const uniqueTaskId = buildUniqueTaskId(projectId, taskId);

          draftState[uniqueTaskId] = buildNewTask(
            projectId,
            taskId,
            taskCommand
          );
        });
      });
    }

    case START_TASK: {
      const { projectId, taskId, timestamp } = action;

      const uniqueTaskId = buildUniqueTaskId(projectId, taskId);

      return produce(state, draftState => {
        draftState[uniqueTaskId].status = 'running';
        draftState[uniqueTaskId].timeSinceStatusChange = timestamp;
      });
    }

    case ABORT_TASK:
    case COMPLETE_TASK: {
      const { projectId, taskId, timestamp } = action;

      const uniqueTaskId = buildUniqueTaskId(projectId, taskId);

      return produce(state, draftState => {
        draftState[uniqueTaskId].status = 'idle';
        draftState[uniqueTaskId].timeSinceStatusChange = timestamp;
      });
    }

    default:
      return state;
  }
};
