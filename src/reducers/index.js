import { combineReducers } from 'redux';

import projects from './projects.reducer';
import tasks from './tasks.reducer';
import dependencies from './dependencies.reducer';
import modal from './modal.reducer';
import onboardingStatus from './onboarding-status.reducer';

export default combineReducers({
  projects,
  tasks,
  dependencies,
  modal,
  onboardingStatus,
});
