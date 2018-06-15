// @flow
import uuid from 'uuid/v1';

import {
  loadGuppyProjects,
  loadAllProjectDependencies,
} from '../services/read-from-disk.service';
import { getInternalProjectById } from '../reducers/projects.reducer';

import type { Project, Task, Dependency } from '../types';

//
//
// Action Types
// TODO: Do this with Flow
// https://flow.org/en/docs/react/redux/
//
export const REFRESH_PROJECTS = 'REFRESH_PROJECTS';
export const CREATE_NEW_PROJECT_START = 'CREATE_NEW_PROJECT_START';
export const CREATE_NEW_PROJECT_CANCEL = 'CREATE_NEW_PROJECT_CANCEL';
export const CREATE_NEW_PROJECT_FINISH = 'CREATE_NEW_PROJECT_FINISH';
export const ADD_PROJECT = 'ADD_PROJECT';
export const HIDE_MODAL = 'HIDE_MODAL';
export const DISMISS_SIDEBAR_INTRO = 'DISMISS_SIDEBAR_INTRO';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const RUN_TASK = 'RUN_TASK';
export const ATTACH_PROCESS_ID_TO_TASK = 'ATTACH_PROCESS_ID_TO_TASK';
export const ABORT_TASK = 'ABORT_TASK';
export const COMPLETE_TASK = 'COMPLETE_TASK';
export const RECEIVE_DATA_FROM_TASK_EXECUTION =
  'RECEIVE_DATA_FROM_TASK_EXECUTION';
export const LAUNCH_DEV_SERVER = 'LAUNCH_DEV_SERVER';
export const LOAD_DEPENDENCY_INFO_FROM_DISK = 'LOAD_DEPENDENCY_INFO_FROM_DISK';
export const ADD_DEPENDENCY_START = 'ADD_DEPENDENCY_START';
export const ADD_DEPENDENCY_ERROR = 'ADD_DEPENDENCY_ERROR';
export const ADD_DEPENDENCY_FINISH = 'ADD_DEPENDENCY_FINISH';
export const UPDATE_DEPENDENCY_START = 'UPDATE_DEPENDENCY_START';
export const UPDATE_DEPENDENCY_ERROR = 'UPDATE_DEPENDENCY_ERROR';
export const UPDATE_DEPENDENCY_FINISH = 'UPDATE_DEPENDENCY_FINISH';
export const DELETE_DEPENDENCY_START = 'DELETE_DEPENDENCY_START';
export const DELETE_DEPENDENCY_ERROR = 'DELETE_DEPENDENCY_ERROR';
export const DELETE_DEPENDENCY_FINISH = 'DELETE_DEPENDENCY_FINISH';
export const IMPORT_EXISTING_PROJECT_START = 'IMPORT_EXISTING_PROJECT_START';
export const IMPORT_EXISTING_PROJECT_FINISH = 'IMPORT_EXISTING_PROJECT_FINISH';
//
//
// Action Creators
//
export const addProject = (project: Project) => ({
  type: ADD_PROJECT,
  project,
});

export const refreshProjects = () => {
  return (dispatch: any, getState: any) => {
    const { paths } = getState();

    // I wish Flow would let me use Object.values =(
    const pathValues = Object.keys(paths).map(pathKey => paths[pathKey]);

    loadGuppyProjects(pathValues).then(projects =>
      dispatch({
        type: REFRESH_PROJECTS,
        projects,
      })
    );
  };
};

export const loadDependencyInfoFromDisk = (project: Project) => {
  return (dispatch: any, getState: Function) => {
    // The `project` this action receives is the "fit-for-consumption" one.
    // We need the internal version, `ProjectInternal`, so that we can see the
    // raw dependency information.
    const internalProject = getInternalProjectById(project.id, getState());

    loadAllProjectDependencies(internalProject, project.path).then(
      dependencies => {
        dispatch({
          type: LOAD_DEPENDENCY_INFO_FROM_DISK,
          project,
          dependencies,
        });
      }
    );
  };
};

export const createNewProjectStart = () => ({
  type: CREATE_NEW_PROJECT_START,
});

export const createNewProjectCancel = () => ({
  type: CREATE_NEW_PROJECT_CANCEL,
});

export const createNewProjectFinish = () => ({
  type: CREATE_NEW_PROJECT_FINISH,
});

export const dismissSidebarIntro = () => ({
  type: DISMISS_SIDEBAR_INTRO,
});

export const selectProject = (projectId: string) => ({
  type: SELECT_PROJECT,
  projectId,
});

export const runTask = (task: Task, timestamp: Date) => ({
  type: RUN_TASK,
  task,
  timestamp,
});

export const attachProcessIdToTask = (task: Task, processId: number) => ({
  type: ATTACH_PROCESS_ID_TO_TASK,
  task,
  processId,
});

export const abortTask = (task: Task, timestamp: Date) => ({
  type: ABORT_TASK,
  task,
  timestamp,
});

export const completeTask = (
  task: Task,
  timestamp: Date,
  wasSuccessful: boolean
) => ({
  type: COMPLETE_TASK,
  task,
  timestamp,
  wasSuccessful,
});

export const receiveDataFromTaskExecution = (
  task: Task,
  text: string,
  isError?: boolean
) => ({
  type: RECEIVE_DATA_FROM_TASK_EXECUTION,
  task,
  text,
  isError,
  logId: uuid(),
});

export const launchDevServer = (task: Task, timestamp: Date) => ({
  type: LAUNCH_DEV_SERVER,
  task,
  timestamp,
});

export const deleteDependencyStart = (
  projectId: string,
  dependencyName: string
) => ({
  type: DELETE_DEPENDENCY_START,
  projectId,
  dependencyName,
});

export const deleteDependencyError = (
  projectId: string,
  dependencyName: string
) => ({
  type: DELETE_DEPENDENCY_ERROR,
  projectId,
  dependencyName,
});

export const deleteDependencyFinish = (
  projectId: string,
  dependencyName: string
) => ({
  type: DELETE_DEPENDENCY_FINISH,
  projectId,
  dependencyName,
});

export const updateDependencyStart = (
  projectId: string,
  dependencyName: string,
  latestVersion: string
) => ({
  type: UPDATE_DEPENDENCY_START,
  projectId,
  dependencyName,
  latestVersion,
});

export const updateDependencyError = (
  projectId: string,
  dependencyName: string
) => ({
  type: UPDATE_DEPENDENCY_ERROR,
  projectId,
  dependencyName,
});

export const updateDependencyFinish = (
  projectId: string,
  dependencyName: string,
  latestVersion: string
) => ({
  type: UPDATE_DEPENDENCY_FINISH,
  projectId,
  dependencyName,
  latestVersion,
});

export const addDependencyStart = (
  projectId: string,
  dependencyName: string,
  version: string
) => ({
  type: ADD_DEPENDENCY_START,
  projectId,
  dependencyName,
  version,
});

export const addDependencyError = (
  projectId: string,
  dependencyName: string
) => ({
  type: ADD_DEPENDENCY_ERROR,
  projectId,
  dependencyName,
});

export const addDependencyFinish = (
  projectId: string,
  dependency: Dependency
) => ({
  type: ADD_DEPENDENCY_FINISH,
  projectId,
  dependency,
});

export const importExistingProjectStart = (path: string) => ({
  type: IMPORT_EXISTING_PROJECT_START,
  path,
});

export const importExistingProjectFinish = (
  path: string,
  project: Project
) => ({
  type: IMPORT_EXISTING_PROJECT_FINISH,
  path,
  project,
});
