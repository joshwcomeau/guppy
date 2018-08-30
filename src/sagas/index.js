import { all } from 'redux-saga/effects';

import refreshProjectsSaga from './refresh-projects.saga';
import deleteProjectSaga from './delete-project.saga';
import dependencySaga from './dependency.saga';
import importProjectSaga from './import-project.saga';
import taskSaga from './task.saga';

export default function*() {
  yield all([
    refreshProjectsSaga(),
    deleteProjectSaga(),
    dependencySaga(),
    importProjectSaga(),
    taskSaga(),
  ]);
}
