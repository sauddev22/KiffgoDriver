// @flow

import {
  GET_TASK_LIST,
  START_TASK,
  GET_FAILURE_REASONS,
  UPDATE_TASK,
  COMPLETE_TASK,
  ADD_NEW_TASK_TO_LIST,
  GET_TASK_DETAIL,
  SET_NEW_TASK_SEQUENCE,
  DASHBOARD_SEQUENCE_CHANGED,
  TASK_ETA_UPDATE,
} from './ActionTypes';
import DataHandler from '../services/DataHandler';
import {USER_FIELDS_NAME} from '../constants';

export function getTaskListRequest(payload, responseCallback) {
  return {payload, responseCallback, type: GET_TASK_LIST.REQUEST};
}
export function getTaskListSuccess(data, completed) {
  return {
    data,
    completed,
    type: GET_TASK_LIST.SUCCESS,
  };
}
export function startTaskRequest(payload, responseCallback) {
  const networkStatus = DataHandler?.getStore()?.getState()?.general
    ?.networkStatus;

  const allowOffline = DataHandler?.getStore()?.getState()?.user?.data[
    USER_FIELDS_NAME.BUSINESS
  ].offline_mode;
  if (allowOffline && !networkStatus) {
    return {
      payload,
      responseCallback,
      type: START_TASK.OFFLINE,
    };
  } else {
    return {
      payload,
      responseCallback,
      type: START_TASK.REQUEST,
    };
  }
}
export function startTaskSuccess(data, sequence) {
  return {
    data,
    sequence,
    type: START_TASK.SUCCESS,
  };
}
export function getFailureReasonRequest(responseCallback) {
  return {
    responseCallback,
    type: GET_FAILURE_REASONS.REQUEST,
  };
}
export function getFailureReasonSuccess(data) {
  return {
    data,
    type: GET_FAILURE_REASONS.SUCCESS,
  };
}
export function updateTask(data) {
  return {
    data,
    type: UPDATE_TASK,
  };
}
export function completeTaskRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: payload.isOffline ? COMPLETE_TASK.OFFLINE : COMPLETE_TASK.REQUEST,
  };
}
export function completeTaskSuccess(data) {
  return {
    data,
    type: COMPLETE_TASK.SUCCESS,
  };
}
export function manipulateTaskList(task, action) {
  return {
    task,
    action,
    type: ADD_NEW_TASK_TO_LIST,
  };
}

export function getTaskDetailRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: GET_TASK_DETAIL.REQUEST,
  };
}
export function getTaskDetailSuccess(data) {
  return {
    data,
    type: GET_TASK_DETAIL.SUCCESS,
  };
}
export function setNewTaskListSequenceRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: SET_NEW_TASK_SEQUENCE.REQUEST,
  };
}
export function setNewTaskListSequenceSuccess(data) {
  return {
    data,
    type: SET_NEW_TASK_SEQUENCE.SUCCESS,
  };
}
export function dashboardSequenceChanged(data) {
  return {
    data,
    type: DASHBOARD_SEQUENCE_CHANGED,
  };
}
export function taskEtaUpdate(data) {
  return {
    data,
    type: TASK_ETA_UPDATE,
  };
}
