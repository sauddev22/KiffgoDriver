// @flow
import Immutable from 'seamless-immutable';
import _ from 'lodash';
import {
  GET_CSRF_TOKEN,
  SET_TRACKING_MODE,
  SET_SELECTED_TAB,
  SET_FIRST_TIME,
  LOGOUT,
  AVAILABILITY_LAST_VISIT,
  SET_ENV,
  GET_VEHICLES,
  USER_LOGOUT,
  SET_TAB_SELECTED_TASK,
  CHANGE_NETWORK_STATUS,
  SET_SYNCING,
} from '../actions/ActionTypes';
import {TRACKING_MODE} from '../constants';
import moment from 'moment-timezone';

const initialState = Immutable({
  csrf_token: '',
  trackingMode: TRACKING_MODE.NONE,
  vehicles: [],
  selectedTab: 0,
  selectedTaskTab: 1,
  isFirstTime: true,
  lastAvailabilityVisit: -1,
  env: 'Dev',
  networkStatus: false,
  isSyncing: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CSRF_TOKEN.SUCCESS: {
      return Immutable.merge(state, {
        csrf_token: action.token,
      });
    }
    case SET_TRACKING_MODE: {
      return Immutable.merge(state, {
        trackingMode: action.modeName,
      });
    }
    case SET_SELECTED_TAB: {
      return Immutable.merge(state, {
        selectedTab: action.selectedTab,
      });
    }
    case SET_FIRST_TIME: {
      return Immutable.merge(state, {
        isFirstTime: false,
      });
    }
    case LOGOUT: {
      return Immutable.merge(state, {
        csrf_token: '',
      });
    }
    // when user logout then empty data
    case AVAILABILITY_LAST_VISIT: {
      return Immutable.merge(state, {
        lastAvailabilityVisit: action.data,
      });
    }

    case SET_ENV: {
      return Immutable.merge(state, {
        env: action.env,
      });
    }
    case GET_VEHICLES.SUCCESS: {
      return Immutable.merge(state, {
        vehicles: action.data,
      });
    }
    case USER_LOGOUT.SUCCESS: {
      return Immutable.merge(state, {
        selectedTab: 0,
      });
    }
    case SET_TAB_SELECTED_TASK: {
      return Immutable.merge(state, {
        selectedTaskTab: action.tab,
      });
    }
    case CHANGE_NETWORK_STATUS: {
      return Immutable.merge(state, {
        networkStatus: action.status,
      });
    }
    case SET_SYNCING: {
      return Immutable.merge(state, {
        isSyncing: action.data,
      });
    }
    default:
      return state;
  }
};
