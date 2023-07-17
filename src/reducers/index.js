import {combineReducers} from 'redux';

import user from './user';
import general from './general';
import task from './task';

export default combineReducers({
  user,
  general,
  task,
});
