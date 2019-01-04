// @flow
import produce from 'immer';
import {
  EXPORT_TO_CODESANDBOX_START,
  EXPORT_TO_CODESANDBOX_FINISH,
} from '../actions';
import type { Action } from '../actions/types';

type ById = {
  [id: string]: {
    exportingActive: boolean,
  },
};

type State = {
  byId: ById,
};

type GlobalState = {
  projectStatus: State,
};

export const initialState = {
  byId: {},
};

export default (state: State = initialState, action: Action = {}) => {
  switch (action.type) {
    case EXPORT_TO_CODESANDBOX_START: {
      const { projectId } = action;
      return produce(state, draftState => {
        draftState.byId[projectId] = {
          exportingActive: true,
        };
      });
    }

    case EXPORT_TO_CODESANDBOX_FINISH: {
      const { projectId } = action;
      return produce(state, draftState => {
        draftState.byId[projectId] = {
          exportingActive: false,
        };
      });
    }
    default:
      return state;
  }
};

export const getExportingActiveStatus = (
  state: GlobalState,
  projectId: ?string
) =>
  projectId &&
  state.projectStatus.byId[projectId] &&
  state.projectStatus.byId[projectId].exportingActive;
