import { combineReducers } from 'redux';

import projects from './projects.reducer';
import initializing from './initializing.reducer';

export default combineReducers({
  initializing,
  projects,
});
