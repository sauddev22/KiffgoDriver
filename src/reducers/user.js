// @flow
import Immutable from 'seamless-immutable';
import _ from 'lodash';
import {
  //old
  USER_LOGIN,
  USER_LOGOUT,
  REFRESH_TOKEN,
  USER_STATUS_UPDATE,
  UPDATE_USER_PROFILE,
  GET_USER_DATA,
  SET_ENV,
  DM_CHANGE_ROUTE_STATUS,
} from '../actions/ActionTypes';
import {USER_FIELDS_NAME} from '../constants';

const initialState = Immutable({
  data: {access_token: 'wewr'},
  vehicleData: {},
  profileSections: [],
  passData: {},
  profileData: {},
});

export default (state = initialState, action) => {
  switch (action.type) {
    //removing saved password once saved to the keychain

    case USER_LOGIN.SUCCESS: {
      return Immutable.merge(state, {
        data: action.data,
      });
    }
    case GET_USER_DATA.SUCCESS: {
      return Immutable.merge(state, {
        data: action.data,
      });
    }
    case USER_STATUS_UPDATE.SUCCESS: {
      const cloned = _.cloneDeep(state.data);
      cloned.status = action.data.status;
      cloned.is_online = action.data.status === 'ACTIVE';
      return Immutable.merge(state, {
        data: cloned,
      });
    }
    case UPDATE_USER_PROFILE.SUCCESS: {
      const cloned = _.cloneDeep(state.data);
      cloned.image = action.data.image;
      return Immutable.merge(state, {
        data: cloned,
      });
    }
    case REFRESH_TOKEN: {
      let data = _.cloneDeep(state.data);
      data.access_token = action.data.access_token;

      return Immutable.merge(state, {
        data,
      });
    }
    case USER_LOGOUT.SUCCESS: {
      let data = _.cloneDeep(state.data);
      data.refresh_token = 'removed from USER_LOGOUT.SUCCESS';
      return Immutable.merge(state, initialState);
    }
    case SET_ENV: {
      return Immutable.merge(state, initialState);
    }
    case DM_CHANGE_ROUTE_STATUS.SUCCESS: {
      const cloned = _.cloneDeep(state.data);
      cloned[USER_FIELDS_NAME.ROUTE_STARTED] = action.data.route_started;
      return Immutable.merge(state, {
        data: cloned,
      });
    }
    // when user logout then empty data
    default:
      return state;
  }
};
