import { combineReducers } from 'redux';

import projects from './projects.reducer';
import tasks from './tasks.reducer';
import notifications from './notifications.reducer';
import dependencies from './dependencies.reducer';
import modal from './modal.reducer';
import onboardingStatus from './onboarding-status.reducer';
import paths from './paths.reducer';

export default combineReducers({
  projects,
  tasks,
  notifications,
  dependencies,
  modal,
  onboardingStatus,
  paths,
});
