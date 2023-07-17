import {take, put, call, fork, takeEvery} from 'redux-saga/effects';

import {
  GET_CSRF_TOKEN,
  UPDATE_DEVICE_ID,
  UPLOAD_SINGLE_IMAGE,
  GET_VEHICLES,
  GET_NOTIFICATION_DATA,
  SCREEN_STATUS,
  DM_CALCULATE_ETA,
  ADD_LOGS,
  DM_SYNC_FILE,
} from '../actions/ActionTypes';
import {SAGA_ALERT_TIMEOUT, SOMETHING_WRONG} from '../constants';
import {
  getCsrfTokenSuccess,
  getVehiclesSuccess,
  dmSyncFileSuccess,
} from '../actions/GeneralActions';

import {
  GET_CSRF_TOKEN as GET_CSRF_TOKEN_URL,
  UPDATE_DEVICE_ID as UPDATE_DEVICE_ID_URL,
  GET_VEHICLES as GET_VEHICLES_URL,
  UPLOAD_IMAGE as UPLOAD_IMAGE_URL,
  GET_NOTIFICATION_DATA as GET_NOTIFICATION_DATA_URL,
  SCREEN_STATUS as SCREEN_STATUS_URL,
  DM_CALCULATE_ETA as DM_CALCULATE_ETA_URL,
  ADD_LOGS as ADD_LOGS_URL,
  DM_SYNC_FILE as DM_SYNC_FILE_URL,
  callRequest,
  CLOUDINARY_URL,
  ERROR_SOMETHING_WENT_WRONG,
} from '../config/WebService';
import ApiSauce from '../services/ApiSauce';
import Util from '../util';
import {writeLog} from '../Helper/loggerHelper';

function alert(message, type = 'error') {
  console.log(message);
  setTimeout(() => {
    Util.topAlert(message, false, 'general saga error 2');
  }, SAGA_ALERT_TIMEOUT);
}

function* getCsrfToken() {
  while (true) {
    const {responseCallback} = yield take(GET_CSRF_TOKEN.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_CSRF_TOKEN_URL,
        {},
        '',
        {},
        ApiSauce,
      );
      if (response) {
        yield put(getCsrfTokenSuccess(response._csrf));
        if (responseCallback) responseCallback(true, null);
      } else {
        alert('Something went wrong');
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 59',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 67',
      );
    }
  }
}

function* updateDeviceToken() {
  while (true) {
    const {payload, responseCallback} = yield take(UPDATE_DEVICE_ID.REQUEST);
    try {
      const response = yield call(
        callRequest,
        UPDATE_DEVICE_ID_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      console.log({response, payload});
      if (response) {
        if (responseCallback) responseCallback(true, null);
      } else {
        alert('Something went wrong');
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 92',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 100',
      );
    }
  }
}

function* getVehicles() {
  while (true) {
    const {responseCallback} = yield take(GET_VEHICLES.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_VEHICLES_URL,
        {},
        '',
        {},
        ApiSauce,
      );

      if (response.status) {
        if (responseCallback) responseCallback(true);

        yield put(getVehiclesSuccess(response.data));
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.message || ERROR_SOMETHING_WENT_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 128',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 136',
      );
    }
  }
}

function* uploadSingleImage() {
  while (true) {
    const {payload, responseCallback} = yield take(UPLOAD_SINGLE_IMAGE.REQUEST);
    try {
      const response = yield call(
        callRequest,
        UPLOAD_IMAGE_URL,
        payload,
        '',
        {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        ApiSauce,
        CLOUDINARY_URL,
      );

      if (response.secure_url) {
        if (responseCallback) responseCallback(true, response);
      } else {
        if (responseCallback) responseCallback(false, {});
        alert(ERROR_SOMETHING_WENT_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 165',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 173',
      );
    }
  }
}

function* getNotificationData(action) {
  const {payload, responseCallback} = action;
  try {
    const response = yield call(
      callRequest,
      GET_NOTIFICATION_DATA_URL,
      payload,
      '',
      {},
      ApiSauce,
    );

    if (response) {
      if (responseCallback) {
        responseCallback(true, response.data);
      }
    } else {
      if (responseCallback) responseCallback(false, {});
      alert(ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        response.error || SOMETHING_WRONG,
        'from general saga from line 200',
      );
    }
  } catch (err) {
    console.log(err);
    console.log('this was the error ' + err);
    if (responseCallback) responseCallback(null, err);
    alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
    writeLog(
      err.data ? err.data.message : SOMETHING_WRONG,
      'from general saga from line 211',
    );
  }
}

function* screenStatusRequest() {
  while (true) {
    const {payload, responseCallback} = yield take(SCREEN_STATUS.REQUEST);
    try {
      const response = yield call(
        callRequest,
        SCREEN_STATUS_URL,
        payload,
        '',
        {},
        ApiSauce,
      );

      if (response.status) {
        if (responseCallback) responseCallback(true, response);
      } else {
        if (responseCallback) responseCallback(false, {});
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 230',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 243',
      );
    }
  }
}
function* addLogsToServer() {
  while (true) {
    const {payload, responseCallback} = yield take(ADD_LOGS.REQUEST);
    try {
      const response = yield call(
        callRequest,
        ADD_LOGS_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        if (responseCallback) responseCallback(true, response);
      } else {
        if (responseCallback) responseCallback(false, {});
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 272',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 280',
      );
    }
  }
}

function* calculateEta() {
  while (true) {
    const {} = yield take(DM_CALCULATE_ETA.REQUEST);
    try {
      const response = yield call(
        callRequest,
        DM_CALCULATE_ETA_URL,
        {},
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        console.log({response});
      } else {
        alert(response.message || ERROR_SOMETHING_WENT_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 304',
        );
      }
    } catch (err) {
      console.log({err});
      alert(err.message);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 312',
      );
    }
  }
}
function* syncFileToServer() {
  while (true) {
    const {payload, responseCallback} = yield take(DM_SYNC_FILE.REQUEST);
    try {
      const response = yield call(
        callRequest,
        DM_SYNC_FILE_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(dmSyncFileSuccess(response));
        if (responseCallback) responseCallback(true, response);
      } else {
        if (responseCallback) responseCallback(false, {});
        writeLog(
          response.error || SOMETHING_WRONG,
          'from general saga from line 272',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : ERROR_SOMETHING_WENT_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from general saga from line 280',
      );
    }
  }
}

export default function* root() {
  yield fork(getCsrfToken);
  yield fork(updateDeviceToken);
  yield fork(getVehicles);
  yield fork(uploadSingleImage);
  yield fork(screenStatusRequest);
  yield fork(calculateEta);
  yield fork(addLogsToServer);
  yield fork(syncFileToServer);
  yield takeEvery(GET_NOTIFICATION_DATA.REQUEST, getNotificationData);
}
