import {take, put, call, fork, takeLatest} from 'redux-saga/effects';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_STATUS_UPDATE,
  USER_FORGOT_PASSWORD,
  USER_CHANGE_PASSWORD,
  UPDATE_USER_PROFILE,
  UPLOAD_IMAGE,
  GET_USER_DATA,
  DM_CHANGE_ROUTE_STATUS,
} from '../actions/ActionTypes';
import {
  SAGA_ALERT_TIMEOUT,
  SOMETHING_WRONG,
  USER_FIELDS_NAME,
} from '../constants';
import {
  userLoginSuccess,
  userLogoutSuccess,
  userStatusUpdateSuccess,
  userForgotPasswordSuccess,
  uploadImageSuccess,
  userUpdateProfileSuccess,
  getUserDataSuccess,
  changeRouteStatusSuccess,
} from '../actions/UserActions';
import {
  USER_LOGIN as USER_LOGIN_URL,
  USER_LOGOUT as USER_LOGOUT_URL,
  USER_FORGOT_PASSWORD as USER_FORGOT_PASSWORD_URL,
  USER_CHANGE_PASSWORD as USER_CHANGE_PASSWORD_URL,
  UPDATE_USER_PROFILE as UPDATE_USER_PROFILE_URL,
  UPLOAD_IMAGE as UPLOAD_IMAGE_URL,
  GET_USER_DATA as GET_USER_DATA_URL,
  callRequest,
  USER_STATUS_UPDATE as USER_STATUS_UPDATE_URL,
  DM_CHANGE_ROUTE_STATUS as DM_CHANGE_ROUTE_STATUS_URL,
  CLOUDINARY_URL,
} from '../config/WebService';
import ApiSauce from '../services/ApiSauce';
import Util from '../util';
import {make_user_data} from '../Helper';
import {makeUserData} from '../Helper/userHelper';
import util from '../util';
import {readLogs, writeLog} from '../Helper/loggerHelper';

function alert(message, type = 'error') {
  setTimeout(() => {
    Util.topAlert(message, false, 'user saga error 4');
  }, SAGA_ALERT_TIMEOUT);
}

function* userLogin() {
  while (true) {
    const {payload, responseCallback} = yield take(USER_LOGIN.REQUEST);
    try {
      const response = yield call(
        callRequest,
        USER_LOGIN_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        writeLog(
          '+++++++++++ New user LoggedIn +++++++++++',
          '>>>>>>>>> email ' +
            response.data.email +
            ' -> Name ' +
            response.data.name +
            ' -> Phone ' +
            response.data.phone +
            '<<<<<<<<<<<<<',
        );
        yield put(userLoginSuccess(makeUserData(response.data)));
        if (responseCallback)
          responseCallback(
            true,
            response.data[USER_FIELDS_NAME.SHOW_CHANGE_PASSWORD],
          );
      } else {
        if (responseCallback) responseCallback(false, false);

        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 76',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false, false);

      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 84',
      );
      readLogs();
    }
  }
}
function* getUserData() {
  while (true) {
    const {responseCallback} = yield take(GET_USER_DATA.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_USER_DATA_URL,
        {},
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(getUserDataSuccess(makeUserData(response.data)));
        if (responseCallback) responseCallback();
      } else {
        if (responseCallback) responseCallback(false, false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 109',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false, false);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 117',
      );
    }
  }
}
function* userLogout() {
  while (true) {
    const {responseCallback} = yield take(USER_LOGOUT.REQUEST);
    try {
      const response = yield call(
        callRequest,
        USER_LOGOUT_URL,
        {token: util.getCurrentUserRefreshToken()},
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        if (responseCallback) responseCallback(true);
        yield put(userLogoutSuccess());
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 140',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 148',
      );
    }
  }
}
function* userForgotPassword() {
  while (true) {
    const {payload, responseCallback} = yield take(
      USER_FORGOT_PASSWORD.REQUEST,
    );
    try {
      const response = yield call(
        callRequest,
        USER_FORGOT_PASSWORD_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(userForgotPasswordSuccess(response.data));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 175',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 185',
      );
    }
  }
}
function* userChangePassword() {
  while (true) {
    const {payload, responseCallback} = yield take(
      USER_CHANGE_PASSWORD.REQUEST,
    );
    try {
      const response = yield call(
        callRequest,
        USER_CHANGE_PASSWORD_URL,
        payload,
        '',
        {},
        ApiSauce,
      );

      if (response.status) {
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 210',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 218',
      );
    }
  }
}

function* userStatusUpdate() {
  while (true) {
    const {payload, responseCallback} = yield take(USER_STATUS_UPDATE.REQUEST);
    try {
      const response = yield call(
        callRequest,
        USER_STATUS_UPDATE_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        console.log({SagaData: response.data});
        yield put(userStatusUpdateSuccess(makeUserData(response.data)));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 245',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 253',
      );
    }
  }
}
function* userProfileUpdate() {
  while (true) {
    const {payload, responseCallback} = yield take(UPDATE_USER_PROFILE.REQUEST);
    try {
      const response = yield call(
        callRequest,
        UPDATE_USER_PROFILE_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(userUpdateProfileSuccess(payload));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 279',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 286',
      );
    }
  }
}
function* updateUSerRouteStatus() {
  while (true) {
    const {payload, responseCallback} = yield take(
      DM_CHANGE_ROUTE_STATUS.REQUEST,
    );
    try {
      const response = yield call(
        callRequest,
        DM_CHANGE_ROUTE_STATUS_URL,
        payload,
        '',
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(changeRouteStatusSuccess(payload));
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response.error || SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 279',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 286',
      );
    }
  }
}
function* uploadImage() {
  while (true) {
    const {payload, responseCallback} = yield take(UPLOAD_IMAGE.REQUEST);

    try {
      const response = yield call(
        callRequest,
        UPLOAD_IMAGE_URL,
        payload,
        '',
        {
          Accept: 'multipart/form-data',
        },
        ApiSauce,
        CLOUDINARY_URL,
      );

      if (response.secure_url) {
        if (responseCallback) responseCallback(true, response);
        yield put(uploadImageSuccess(response));
      } else {
        if (responseCallback) responseCallback(false, {});
        alert(SOMETHING_WRONG);
        writeLog(
          response.error || SOMETHING_WRONG,
          'from user saga from line 316',
        );
      }
    } catch (err) {
      if (responseCallback) responseCallback(null, err);
      alert(err.data ? err.data.message : SOMETHING_WRONG);
      writeLog(
        err.data ? err.data.message : SOMETHING_WRONG,
        'from user saga from line 324',
      );
    }
  }
}

export default function* root() {
  yield fork(userLogin);
  yield fork(userLogout);
  yield fork(userStatusUpdate);
  yield fork(userForgotPassword);
  yield fork(userChangePassword);
  yield fork(userProfileUpdate);
  yield fork(uploadImage);
  yield fork(getUserData);
  yield fork(updateUSerRouteStatus);
}
