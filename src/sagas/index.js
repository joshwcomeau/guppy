import { all } from 'redux-saga/effects';
import dependencySaga from './dependency.saga';

export default function*() {
  yield all([dependencySaga()]);
}
