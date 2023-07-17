// @flow

import {
  GET_CSRF_TOKEN,
  UPDATE_DEVICE_ID,
  SET_SELECTED_TAB,
  SET_FIRST_TIME,
  LOGOUT,
  AVAILABILITY_LAST_VISIT,
  SET_TRACKING_MODE,
  SET_ENV,
  GET_VEHICLES,
  UPLOAD_SINGLE_IMAGE,
  GET_NOTIFICATION_DATA,
  SET_TAB_SELECTED_TASK,
  SCREEN_STATUS,
  DM_CALCULATE_ETA,
  ADD_LOGS,
  CHANGE_NETWORK_STATUS,
  SET_SYNCING,
  DM_SYNC_FILE,
} from './ActionTypes';

export function getCsrfTokenRequest(responseCallback) {
  return {
    responseCallback,
    type: GET_CSRF_TOKEN.REQUEST,
  };
}

export function getCsrfTokenSuccess(token) {
  return {
    token,
    type: GET_CSRF_TOKEN.SUCCESS,
  };
}

export function updateDeviceTokenRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: UPDATE_DEVICE_ID.REQUEST,
  };
}

export function setSelectedTab(selectedTab) {
  return {
    selectedTab,
    type: SET_SELECTED_TAB,
  };
}
export function setFirstTime() {
  return {
    type: SET_FIRST_TIME,
  };
}
export function logout() {
  return {type: LOGOUT};
}
export function updateLastAvailabilityVisit(data) {
  return {data, type: AVAILABILITY_LAST_VISIT};
}
export function setTrackingMode(modeName) {
  return {
    modeName,
    type: SET_TRACKING_MODE,
  };
}
export function setEnv(env) {
  return {env, type: SET_ENV};
}
export function getVehiclesRequest(responseCallback) {
  return {
    responseCallback,
    type: GET_VEHICLES.REQUEST,
  };
}
export function getVehiclesSuccess(data) {
  return {
    data,
    type: GET_VEHICLES.SUCCESS,
  };
}
export function dmSyncFileRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: DM_SYNC_FILE.REQUEST,
  };
}
export function dmSyncFileSuccess(data) {
  return {
    data,
    type: DM_SYNC_FILE.SUCCESS,
  };
}
export function uploadSingleImage(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: UPLOAD_SINGLE_IMAGE.REQUEST,
  };
}
export function getNotificationDataRequest(payload, responseCallback) {
  return {
    responseCallback,
    payload,
    type: GET_NOTIFICATION_DATA.REQUEST,
  };
}
export function screenStatusRequest(payload, responseCallback) {
  return {
    responseCallback,
    payload,
    type: SCREEN_STATUS.REQUEST,
  };
}
export function addLogsToServer(payload, responseCallback) {
  return {
    responseCallback,
    payload,
    type: ADD_LOGS.REQUEST,
  };
}
export function calculateEtaRequest() {
  return {
    type: DM_CALCULATE_ETA.REQUEST,
  };
}
export function setTaskTab(tab) {
  return {
    tab,
    type: SET_TAB_SELECTED_TASK,
  };
}
export function setNetworkStatus(status) {
  return {
    status,
    type: CHANGE_NETWORK_STATUS,
  };
}
export function setSyncing(data) {
  return {
    data,
    type: SET_SYNCING,
  };
}
