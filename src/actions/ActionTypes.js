// @flow
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const CANCEL = 'CANCEL';
const FAILURE = 'FAILURE';
const OFFLINE = 'OFFLINE';

function createRequestTypes(base) {
  const res = {};
  [REQUEST, SUCCESS, FAILURE, CANCEL, OFFLINE].forEach(type => {
    res[type] = `${base}_${type}`;
  });

  return res;
}

export const NETWORK_INFO = 'NETWORK_INFO';
export const SET_FIRST_TIME = 'SET_FIRST_TIME';

export const USER_LOGIN = createRequestTypes('USER_LOGIN');
export const UPLOAD_IMAGE = createRequestTypes('UPLOAD_IMAGE');
export const UPLOAD_SINGLE_IMAGE = createRequestTypes('UPLOAD_SINGLE_IMAGE');
export const USER_STATUS_UPDATE = createRequestTypes('USER_STATUS_UPDATE');
export const REMOVE_PASSWORD = 'REMOVE_PASSWORD';
export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';
export const EMPTY_AVAILABLE_JOBS = 'EMPTY_AVAILABLE_JOBS';
export const ACCEPT_JOB = createRequestTypes('ACCEPT_JOB');
export const GET_ACCEPTED_UPCOMING_JOBS = createRequestTypes(
  'GET_ACCEPTED_UPCOMING_JOBS',
);
export const MARK_AVAILABILITY = createRequestTypes('MARK_AVAILABILITY');
export const GET_AVAILABILITY = createRequestTypes('GET_AVAILABILITY');
export const LEFT_FOR_JOB = createRequestTypes('LEFT_FOR_JOB');
export const ARRIVED_DESTINATION = createRequestTypes('ARRIVED_DESTINATION');
export const STOP_COMPLETE = createRequestTypes('STOP_COMPLETE');
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const UPDATE_JON_IN_PROGRESS = 'UPDATE_JON_IN_PROGRESS';

export const USER_SIGNIN = createRequestTypes('USER_SIGNIN');
export const USER_CONFIRM_OTP_FGPASS = createRequestTypes(
  'USER_CONFIRM_OTP_FGPASS',
);
export const USER_UPDATE_PASSWORD = createRequestTypes('USER_UPDATE_PASSWORD');
export const CONTACT_ADMIN = createRequestTypes('CONTACT_ADMIN');
export const GET_SERVICE_TYPES = createRequestTypes('GET_SERVICE_TYPES');
export const GET_NEARBY_SERVICE_PROVIDERS = createRequestTypes(
  'GET_NEARBY_SERVICE_PROVIDERS',
);
export const CLEAR_SERVICE_PROVIDERS_DATA = 'CLEAR_SERVICE_PROVIDERS_DATA';
export const GET_NEWS = createRequestTypes('GET_NEWS');
export const GET_EVENTS = createRequestTypes('GET_EVENTS');
export const GET_MONTLY_EVENTS = createRequestTypes('GET_MONTLY_EVENTS');
export const GET_SEARCH_EVENTS = createRequestTypes('GET_SEARCH_EVENTS');
export const GET_ORGANIZATIONS = createRequestTypes('GET_ORGANIZATIONS');
export const GET_REVIEWS = createRequestTypes('GET_REVIEWS');
export const GET_PROFILE_SECTIONS = createRequestTypes('GET_PROFILE_SECTIONS');
export const DELETE_PROFILE_SUBSECTION_DATA = createRequestTypes(
  'DELETE_PROFILE_SUBSECTION_DATA',
);

export const GET_BRAIN_TREE_TOKEN = createRequestTypes('GET_BRAIN_TREE_TOKEN');
export const BRAIN_TREE_PAYMENT = createRequestTypes('BRAIN_TREE_PAYMENT');
export const LOGOUT = 'LOGOUT';

export const EMPTY = createRequestTypes('EMPTY');
export const GET_CSRF_TOKEN = createRequestTypes('GET_CSRF_TOKEN');
export const UPDATE_DEVICE_ID = createRequestTypes('UPDATE_DEVICE_ID');

export const DECLINE_JOB = createRequestTypes('DECLINE_JOB');
export const DECLINE_JOB_CANCEL_CONFIRM = createRequestTypes(
  'DECLINE_JOB_CANCEL_CONFIRM',
);
export const JOB_DETAIL = createRequestTypes('JOB_DETAIL');
export const GET_SINGLE_JOB = createRequestTypes('GET_SINGLE_JOB');
export const COMPLETE_JOBS = createRequestTypes('COMPLETE_JOBS');
export const GET_COMPLETE_JOBS_DETAIL = createRequestTypes(
  'GET_COMPLETE_JOBS_DETAIL',
);
export const AVAILABILITY_LAST_VISIT = 'AVAILABILITY_LAST_VISIT';
export const SET_TRACKING_MODE = createRequestTypes('SET_TRACKING_MODE');
export const GET_TRACKING_TOKEN = createRequestTypes('GET_TRACKING_TOKEN');
export const GET_TASK_LIST = createRequestTypes('GET_TASK_LIST');
export const START_TASK = createRequestTypes('START_TASK');
export const COMPLETE_TASK = createRequestTypes('COMPLETE_TASK');
export const UPDATE_TASK = 'UPDATE_TASK';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const USER_LOGOUT = createRequestTypes('USER_LOGOUT');
export const SET_ENV = 'SET_ENV';
export const USER_FORGOT_PASSWORD = createRequestTypes('USER_FORGOT_PASSWORD');
export const USER_CHANGE_PASSWORD = createRequestTypes('USER_CHANGE_PASSWORD');
export const UPDATE_USER_PROFILE = createRequestTypes('UPDATE_USER_PROFILE');
export const GET_USER_DATA = createRequestTypes('GET_USER_DATA');
export const GET_VEHICLES = createRequestTypes('GET_VEHICLES');
export const GET_FAILURE_REASONS = createRequestTypes('GET_FAILURE_REASONS');
export const GET_TASK_DETAIL = createRequestTypes('GET_TASK_DETAIL');
export const ADD_NEW_TASK_TO_LIST = 'ADD_NEW_TASK_TO_LIST';
export const SET_NEW_TASK_SEQUENCE = createRequestTypes(
  'SET_NEW_TASK_SEQUENCE',
);
export const DASHBOARD_SEQUENCE_CHANGED = 'DASHBOARD_SEQUENCE_CHANGED';
export const TASK_ETA_UPDATE = 'TASK_ETA_UPDATE';
export const SET_TAB_SELECTED_TASK = 'SET_TAB_SELECTED_TASK';
export const GET_NOTIFICATION_DATA = createRequestTypes(
  'GET_NOTIFICATION_DATA',
);
export const DM_CALCULATE_ETA = createRequestTypes('DM_CALCULATE_ETA');
export const SCREEN_STATUS = createRequestTypes('SCREEN_STATUS');
export const ADD_LOGS = createRequestTypes('ADD_LOGS');
export const CHANGE_NETWORK_STATUS = 'CHANGE_NETWORK_STATUS';
export const SET_SYNCING = 'SET_SYNCING';
export const DM_CHANGE_ROUTE_STATUS = createRequestTypes(
  'DM_CHANGE_ROUTE_STATUS',
);
export const DM_SYNC_FILE = createRequestTypes('DM_SYNC_FILE');
