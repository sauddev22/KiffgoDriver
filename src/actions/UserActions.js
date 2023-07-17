// @flow

import {
  USER_LOGIN,
  REFRESH_TOKEN,
  USER_LOGOUT,
  USER_STATUS_UPDATE,
  USER_FORGOT_PASSWORD,
  USER_CHANGE_PASSWORD,
  UPDATE_USER_PROFILE,
  UPLOAD_IMAGE,
  GET_USER_DATA,
  DM_CHANGE_ROUTE_STATUS,
} from './ActionTypes';

//Requesting otp from server
//success action when otp is verified by yhe serve

export function userLoginRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: USER_LOGIN.REQUEST,
  };
}
export function userLoginSuccess(data) {
  return {
    data,
    type: USER_LOGIN.SUCCESS,
  };
}
export function userStatusUpdateRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: USER_STATUS_UPDATE.REQUEST,
  };
}
export function userStatusUpdateSuccess(data) {
  return {
    data,
    type: USER_STATUS_UPDATE.SUCCESS,
  };
}
export function userLogoutRequest(responseCallback) {
  return {
    responseCallback,
    type: USER_LOGOUT.REQUEST,
  };
}
export function userLogoutSuccess() {
  return {
    type: USER_LOGOUT.SUCCESS,
  };
}
export function refreshTokenSuccess(data) {
  return {
    data,
    type: REFRESH_TOKEN,
  };
}
export function userForgotPasswordRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: USER_FORGOT_PASSWORD.REQUEST,
  };
}
export function userChangePasswordRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: USER_CHANGE_PASSWORD.REQUEST,
  };
}
export function userUpdateProfileRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: UPDATE_USER_PROFILE.REQUEST,
  };
}
export function userUpdateProfileSuccess(data) {
  return {
    data,
    type: UPDATE_USER_PROFILE.SUCCESS,
  };
}
export function userForgotPasswordSuccess(data) {
  return {
    data,
    type: USER_FORGOT_PASSWORD.REQUEST,
  };
}
export function uploadImageRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: UPLOAD_IMAGE.REQUEST,
  };
}
export function uploadImageSuccess(data) {
  return {
    data,
    type: UPLOAD_IMAGE.SUCCESS,
  };
}
export function getUserDataRequest(responseCallback) {
  return {
    responseCallback,
    type: GET_USER_DATA.REQUEST,
  };
}
export function getUserDataSuccess(data) {
  return {
    data,
    type: GET_USER_DATA.SUCCESS,
  };
}
export function changeRouteStatusRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: DM_CHANGE_ROUTE_STATUS.REQUEST,
  };
}
export function changeRouteStatusSuccess(data) {
  return {
    data,
    type: DM_CHANGE_ROUTE_STATUS.SUCCESS,
  };
}
