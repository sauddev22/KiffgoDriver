import {take, put, call, fork, takeLatest} from 'redux-saga/effects';
import {
  GET_TASK_LIST,
  START_TASK,
  GET_FAILURE_REASONS,
  COMPLETE_TASK,
  GET_TASK_DETAIL,
  SET_NEW_TASK_SEQUENCE,
  DM_CHANGE_ROUTE_STATUS,
} from '../actions/ActionTypes';
import {SAGA_ALERT_TIMEOUT, SOMETHING_WRONG} from '../constants';
import {
  getTaskListSuccess,
  getFailureReasonSuccess,
  startTaskSuccess,
  completeTaskSuccess,
  getTaskDetailSuccess,
  setNewTaskListSequenceSuccess,
} from '../actions/TaskActions';
import {
  GET_TASK_LIST as GET_TASK_LIST_URL,
  GET_FAILURE_REASONS as GET_FAILURE_REASONS_URL,
  callRequest,
  USER_STATUS_UPDATE as USER_STATUS_UPDATE_URL,
  START_TASK as START_TASK_URL,
  GET_TASK_DETAIL as GET_TASK_DETAIL_URL,
  COMPLETE_TASK as COMPLETE_TASK_URL,
  SET_NEW_TASK_SEQUENCE as SET_NEW_TASK_SEQUENCE_URL,
  ERROR_SOMETHING_WENT_WRONG,
} from '../config/WebService';
import ApiSauce from '../services/ApiSauce';
import util from '../util';
import {makeTaskData} from '../Helper/taskHelper';
import {writeLog} from '../Helper/loggerHelper';

function alert(message, type = 'error') {
  setTimeout(() => {
    util.topAlert(message, false, 'task saga error 3');
  }, SAGA_ALERT_TIMEOUT);
}

function* getTaskList() {
  while (true) {
    const {payload, responseCallback} = yield take(GET_TASK_LIST.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_TASK_LIST_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(
          getTaskListSuccess(makeTaskData(response.data), payload.completed),
        );
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        console.log('*******************ERROR 1*****************');
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from task saga from line 63',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      console.log('*******************ERROR 2*****************', err);
      alert(ERROR_SOMETHING_WENT_WRONG + ' in get task list');
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from task saga from line 74',
      );
    }
  }
}
function* getTaskDetails() {
  while (true) {
    const {payload, responseCallback} = yield take(GET_TASK_DETAIL.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_TASK_DETAIL_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(getTaskDetailSuccess(makeTaskData(response.data.task)));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from task saga from line 97',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from task saga from line 105',
      );
    }
  }
}

function* startTask() {
  while (true) {
    const {payload, responseCallback} = yield take(START_TASK.REQUEST);
    try {
      const response = yield call(
        callRequest,
        START_TASK_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        console.log({tasDetailData: response.data});
        yield put(
          startTaskSuccess(
            makeTaskData([response.data.task]),
            response.data.seq,
          ),
        );
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from task saga from line 137',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG.message);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from task saga from line 145',
      );
    }
  }
}
function* getReasonList() {
  while (true) {
    const {responseCallback} = yield take(GET_FAILURE_REASONS.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_FAILURE_REASONS_URL,
        {},
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(getFailureReasonSuccess(response.data));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from task saga from line 170',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG.message);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from task saga from line 180',
      );
    }
  }
}
function* getReasonListOnRouteStart() {
  while (true) {
    const {responseCallback} = yield take(DM_CHANGE_ROUTE_STATUS.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_FAILURE_REASONS_URL,
        {},
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(getFailureReasonSuccess(response.data));
      } else {
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from task saga from line 170',
        );
      }
    } catch (err) {
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG.message);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from task saga from line 180',
      );
    }
  }
}
function* completeTask() {
  while (true) {
    const {payload, responseCallback} = yield take(COMPLETE_TASK.REQUEST);
    try {
      const response = yield call(
        callRequest,
        COMPLETE_TASK_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(completeTaskSuccess(response.data));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from task saga from line 203',
        );
      }
    } catch (err) {
      console.log({ponka: err});
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG.message);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from task saga from line 212',
      );
    }
  }
}
function* setNewTaskSequence() {
  while (true) {
    const {payload, responseCallback} = yield take(
      SET_NEW_TASK_SEQUENCE.REQUEST,
    );
    try {
      const response = yield call(
        callRequest,
        SET_NEW_TASK_SEQUENCE_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(setNewTaskListSequenceSuccess(response.data));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from task saga from line 239',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG.message);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from task saga from line 247',
      );
    }
  }
}

export default function* root() {
  yield fork(getTaskList);
  yield fork(startTask);
  yield fork(getReasonList);
  yield fork(completeTask);
  yield fork(getTaskDetails);
  yield fork(setNewTaskSequence);
  yield fork(getReasonListOnRouteStart);
}
