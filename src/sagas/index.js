import { all } from 'redux-saga/effects';
import dependencySaga from './dependency.saga';
import importProjectSaga from './import-project.saga';

export default function*() {
  yield all([dependencySaga(), importProjectSaga()]);
}
