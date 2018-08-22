import { all } from 'redux-saga/effects';
import dependencySaga from './dependency.saga';
import importProjectSaga from './import-project.saga';
import taskSaga from './task.saga';

export default function*() {
  yield all([dependencySaga(), importProjectSaga(), taskSaga()]);
}
