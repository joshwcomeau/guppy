import { all } from 'redux-saga/effects';

import refreshProjectsSaga from './refresh-projects.saga';

export default function*() {
  yield all([refreshProjectsSaga()]);
}
