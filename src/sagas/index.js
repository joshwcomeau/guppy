import { all } from 'redux-saga/effects';
import taskSaga from './task.saga';

export default function*() {
  yield all([taskSaga()]);
}
