import { combineReducers } from 'redux';

import projects from './projects.reducer';
import modal from './modal.reducer';
import onboardingStatus from './onboarding-status.reducer';

export default combineReducers({
  projects,
  modal,
  onboardingStatus,
});
