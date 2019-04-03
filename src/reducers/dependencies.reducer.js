// @flow
import produce from 'immer';
import { combineReducers } from 'redux';

import {
  LOAD_DEPENDENCY_INFO_FROM_DISK_START,
  LOAD_DEPENDENCY_INFO_FROM_DISK_ERROR,
  LOAD_DEPENDENCY_INFO_FROM_DISK_FINISH,
  ADD_DEPENDENCY,
  UPDATE_DEPENDENCY,
  DELETE_DEPENDENCY,
  INSTALL_DEPENDENCIES_START,
  INSTALL_DEPENDENCIES_ERROR,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_START,
  UNINSTALL_DEPENDENCIES_ERROR,
  UNINSTALL_DEPENDENCIES_FINISH,
  REFRESH_PROJECTS_FINISH,
  RESET_ALL_STATE,
} from '../actions';

import type { Dependency } from '../types';

type DependencyMap = {
  [dependencyName: string]: Dependency,
};

type LoadingStatus = 'done' | 'fail' | 'loading';

type LoadedDependenciesState = {
  [projectId: string]: DependencyMap,
};

type LoadingStatusState = {
  [projectId: string]: LoadingStatus,
};

// type State = {
//   loadedDependencies: LoadedDependenciesState,
//   loadingStatus: LoadingStatus,
// };

export const initialState = {
  loadedDependencies: {},
  loadingStatus: {},
};

// Todo: Why do we need to use any instead of Action here?
const loadedDependenciesReducer = (
  state: LoadedDependenciesState = initialState.loadedDependencies,
  action: any = {}
) => {
  switch (action.type) {
    case LOAD_DEPENDENCY_INFO_FROM_DISK_FINISH: {
      const { projectId, dependencies } = action;

      return {
        ...state,
        [projectId]: dependencies,
      };
    }

    case ADD_DEPENDENCY: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName] = {
          name: dependencyName,
          status: 'queued-install',
          // All of the other fields are unknown at this point.
          // To make life simpler, we'll set them to empty strings,
          // rather than deal with nullable fields everywhere else.
          location: 'dependencies',
          description: '',
          version: '',
          homepage: '',
          license: '',
          repository: { type: '', url: '' },
        };
      });
    }

    case UPDATE_DEPENDENCY: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName].status = 'queued-update';
      });
    }

    case DELETE_DEPENDENCY: {
      const { projectId, dependencyName } = action;

      return produce(state, draftState => {
        draftState[projectId][dependencyName].status = 'queued-delete';
      });
    }

    case INSTALL_DEPENDENCIES_START: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          draftState[projectId][dependency.name].status = dependency.updating
            ? 'updating'
            : 'installing';
        });
      });
    }

    case INSTALL_DEPENDENCIES_ERROR: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          if (dependency.updating) {
            draftState[projectId][dependency.name].status = 'idle';
          } else {
            delete draftState[projectId][dependency.name];
          }
        });
      });
    }

    case INSTALL_DEPENDENCIES_FINISH: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          draftState[projectId][dependency.name] = dependency;
          draftState[projectId][dependency.name].status = 'idle';
        });
      });
    }

    case UNINSTALL_DEPENDENCIES_START: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          draftState[projectId][dependency.name].status = 'deleting';
        });
      });
    }

    case UNINSTALL_DEPENDENCIES_ERROR: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          draftState[projectId][dependency.name].status = 'idle';
        });
      });
    }

    case UNINSTALL_DEPENDENCIES_FINISH: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          delete draftState[projectId][dependency.name];
        });
      });
    }

    case REFRESH_PROJECTS_FINISH: {
      const { projects } = action;
      // If a project was removed, clear out its associated dependencies.
      return produce(state, draftState => {
        const depIds = Object.keys(draftState);
        const projectIds = Object.keys(projects);

        depIds.forEach(id => {
          if (!projectIds.includes(id)) {
            delete draftState[id];
          }
        });
      });
    }

    case RESET_ALL_STATE:
      return initialState.loadedDependencies;

    case LOAD_DEPENDENCY_INFO_FROM_DISK_ERROR:
    default:
      return state;
  }
};

const loadingStatusReducer = (
  state: LoadingStatusState = initialState.loadingStatus,
  action: any = {}
) => {
  switch (action.type) {
    case LOAD_DEPENDENCY_INFO_FROM_DISK_START:
      return produce(state, draftState => {
        draftState[action.projectId] = 'loading';
      });

    case LOAD_DEPENDENCY_INFO_FROM_DISK_FINISH:
      return produce(state, draftState => {
        draftState[action.projectId] = 'done';
      });

    case LOAD_DEPENDENCY_INFO_FROM_DISK_ERROR:
      return produce(state, draftState => {
        draftState[action.projectId] = 'fail';
      });

    case REFRESH_PROJECTS_FINISH: {
      const { projects } = action;
      // If a project was removed, clear out its associated dependencies.
      // Duplicate code - same as in loadedDependencies. Could be refactored but two locations are OK for duplication.
      return produce(state, draftState => {
        const depIds = Object.keys(draftState);
        const projectIds = Object.keys(projects);

        depIds.forEach(id => {
          if (!projectIds.includes(id)) {
            delete draftState[id];
          }
        });
      });
    }

    case RESET_ALL_STATE:
      return initialState.loadingStatus;

    default:
      return state;
  }
};

export default combineReducers({
  loadingStatus: loadingStatusReducer,
  loadedDependencies: loadedDependenciesReducer,
});
//
//
//
// Selectors
export const getDependencies = (state: any) =>
  state.dependencies.loadedDependencies;

export const getDependenciesForProjectId = (
  state: any,
  props: { projectId: string }
): DependencyMap => state.dependencies.loadedDependencies[props.projectId];

export const getDependenciesLoadingStatus = (
  state: any,
  props: { projectId: ?string }
): LoadingStatus => state.dependencies.loadingStatus[props.projectId];
