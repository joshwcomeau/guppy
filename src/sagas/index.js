import { all } from 'redux-saga/effects';

import refreshProjectsSaga from './refresh-projects.saga';
import deleteProjectSaga from './delete-project.saga';

export default function*() {
  yield all([refreshProjectsSaga(), deleteProjectSaga()]);
}
