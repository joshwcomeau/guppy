// @flow
import { combineReducers } from 'redux';

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
});
