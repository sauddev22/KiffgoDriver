import {fork} from 'redux-saga/effects';
import user from './user';
import init from './init';
import general from './general';
import task from './task';

export default function* root() {
  yield fork(user);
  yield fork(init);
  yield fork(general);
  yield fork(task);
}
