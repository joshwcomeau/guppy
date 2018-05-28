import { combineReducers } from 'redux';

import projects from './projects.reducer';
import modal from './modal.reducer';
import onboardingStatus from './onboarding-status.reducer';
import initializing from './initializing.reducer';

export default combineReducers({
  initializing,
  modal,
  onboardingStatus,
  projects,
});
