import { REFRESH_PROJECTS, ADD_PROJECT } from '../actions';

import type { Action } from 'redux';

// @flow

type State = {
  [uniqueTaskId: string]: {
    projectId: string,
    taskId: string,
    status: 'idle' | 'running',
    timeSinceStatusChange: Date,
    logs: string,
  },
};

const initialState = {};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case REFRESH_PROJECTS: {
      // This action is fired when the app mounts (and maybe also if the user
      // clicks a button, later?), to let Guppy know about what's on the disk.
      // Guppy doesn't store specific task info on the disk, and so what's
      // already in this reducer is newer / more complete.
      //
      // Only push in tasks for projects we haven't seen before.
      const uniqueProjectIds = new Set();
      Object.values(state).forEach(task =>
        uniqueProjectIds.add(task.projectId)
      );
      const newProjects = action.projects.filter(project => {});
    }
  }
};
