// @flow
import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr'; // todo: Would be better to separate library reducers and add them before creating store. Not sure how to do that and if it's really needed.

import appSettings from './app-settings.reducer';
import appLoaded from './app-loaded.reducer';
import appStatus from './app-status.reducer';
import projects from './projects.reducer';
import tasks from './tasks.reducer';
import dependencies from './dependencies.reducer';
import modal from './modal.reducer';
import onboardingStatus from './onboarding-status.reducer';
import paths from './paths.reducer';
import queue from './queue.reducer';

export default combineReducers({
  appSettings,
  appLoaded,
  appStatus,
  projects,
  tasks,
  dependencies,
  modal,
  onboardingStatus,
  paths,
  queue,
  toastr: toastrReducer,
});
