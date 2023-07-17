// @flow
import {
  Platform,
  Linking,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import moment, {min} from 'moment-timezone';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {showMessage} from 'react-native-flash-message';

import OpenSettings from 'react-native-open-settings';
import * as Keychain from 'react-native-keychain';
import {
  MESSAGE_TYPES,
  LOCATION_PERMISSION_DENIED_ERROR2,
  GOOGLE_API_KEY,
  DATE_FORMAT1,
  DATE_FORMAT3,
  TIME_FORMAT1,
  DATE_TIME_FORMAT7,
  DATE_TIME_FORMAT2,
  TASK_STATUS,
  TASK_FIELDS_NAME,
  TIME_DAY_FORMAT1,
} from '../constants';
import {
  BASE_URL,
  USER_LOGIN,
  GET_CSRF_TOKEN,
  ERROR_SOMETHING_WENT_WRONG,
  TRACKING_BASE_URL,
} from '../config/WebService';
import DataHandler from '../services/DataHandler';
import {Colors} from '../theme';
import ApiSauce from '../services/ApiSauce';
import Snackbar from 'react-native-snackbar';
import Geolocation from 'react-native-geolocation-service';
import _ from 'lodash';
import axios from 'axios';
import {refreshTokenSuccess, userLogoutSuccess} from '../actions/UserActions';
import {stopTracking} from '../Helper/trackingHelper';
import DeviceInfo from 'react-native-device-info';
import {writeLog} from '../Helper/loggerHelper';

class Util {
  keyExtractor = (index: number) => index.toString();
  isPlatformAndroid() {
    return Platform.OS === 'android';
  }
  isValidURL(url: 'string') {
    const re = /^(http|https|fttp):\/\/|[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/;
    return re.test(url);
  }
  isEmailValid(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  isPasswordValid(password: string) {
    return password.length >= 5;
  }
  isValidName(name) {
    return /^[a-zA-Z '.-]*$/.test(name);
  }

  topAlert(message, action, from = 'default') {
    console.log('util topAlert' + message + ' from ' + from);
    if (action) {
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_INDEFINITE,
        action: {
          text: 'ok',
          textColor: 'white',
          onPress: () => null,
        },
      });
    } else {
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }

  topAlertError(message, alertType = MESSAGE_TYPES.ERROR) {
    alert('here');
    showMessage({
      message,
      type: alertType,
      autoHide: false,
      backgroundColor: Colors.red,
      color: Colors.white,
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getFormattedDateTime = (date, format) => {
    if (date) return moment(date).format(format);
    return '';
  };

  getDateObjectFromString = (date, format) => {
    if (date) return moment(date, format).toDate();
    return '';
  };

  isToday = date => {
    const reference = moment();
    const today = reference.clone().startOf('day');
    const given = moment(date);
    const isBefore = moment(date).isBefore(moment(), 'second');
    return given.isSame(today, 'd') && !isBefore;
  };

  getTimeDifference = date =>
    moment.duration(moment(date).diff(moment())).asMinutes();

  showLoader = (instance, loadingFor = '') => {
    if (!instance.state.loading) {
      instance.setState({
        loading: true,
        loadingFor,
      });
    }
  };

  hideLoader = (instance, callback) => {
    if (instance.state.loading) {
      instance.setState(
        {
          loading: false,
          loadingFor: '',
        },
        callback,
      );
    }
  };

  getCurrentUserAccessToken() {
    return DataHandler.getStore().getState().user.data.access_token;
  }
  getCurrentUserRefreshToken() {
    return DataHandler.getStore().getState().user.data.refresh_token;
  }
  isTaskInTransit() {
    const tasks = DataHandler.getStore().getState().task.tasks;
    let task = {};
    if (tasks.length > 0) {
      tasks.forEach(element => {
        if (element.status === TASK_STATUS.IN_TRANSIT) {
          task = element;
        }
      });
    }

    return task;
  }
  async refreshAccessToken() {
    console.log('here in refreshAccessToken');
    const userData = DataHandler.getStore().getState().user.data;
    let options = Object.assign({method: 'POST'});
    let data = {};

    data.token = this.getCurrentUserRefreshToken();
    if (!data.token || data.token === 'removed from USER_LOGOUT.SUCCESS') {
      writeLog(
        '**********referesh token not found***********',
        'from Utils line 170',
      );
      let readableVersion = DeviceInfo.getReadableVersion();
      let brand = DeviceInfo.getBrand();
      let deviceId = DeviceInfo.getDeviceId();
      let model = DeviceInfo.getModel();
      let systemVersion = DeviceInfo.getSystemVersion();
      let deviceInfo = {
        readableVersion,
        brand,
        deviceId,
        model,
        systemVersion,
      };
      data.token = JSON.stringify({
        ...deviceInfo,
        ...userData,
        ...{testData: true},
      });
    }

    console.log({refreshData: data});
    options.body = JSON.stringify(data);
    console.log({options});
    try {
      const response = await fetch(`${BASE_URL}d/refresh-token`, options);
      const responseJson = await response.json();
      DataHandler.getStore().dispatch(refreshTokenSuccess(responseJson.data));
      return responseJson.data.access_token;
    } catch (error) {
      writeLog(error, 'from Utils refreshAccessToken line 200');
      console.log({refreshTokenError: error});
      if (error.message === 'Network request failed') {
        return 'ignore';
      }
      DataHandler.getStore().dispatch(userLogoutSuccess());
      stopTracking('refresh token fail');
      return false;
    }
  }
  getCurrentCsrfToken() {
    return DataHandler.getStore().getState().general.csrf_token;
  }

  isNumber(val) {
    return /^\d+$/.test(val);
  }

  openLinkInBrowser(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: ");
      }
    });
  }

  generateGetParameter(obj) {
    let final = '?';
    for (const key in obj) {
      final = `${final}${key}=${obj[key]}&`;
    }
    final = final.slice(0, -1);
    return final;
  }

  // isValidMobileNumber(str) {
  //   if (!str) return false;
  //   let mobileNumber = str.replace('+', '');
  //   // Number begins with 44
  //   if (str.charAt(0) === '4' && str.charAt(1) === '4') {
  //     mobileNumber = '0' + mobileNumber.slice(2);
  //   }
  //   return /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(mobileNumber);
  // }
  isValidMobileNumber(str) {
    if (!str) return false;
    const isnum = /^\d+$/.test(str);

    console.log({isnum});
    if (str.length < 15 && str.length > 9 && isnum) {
      return true;
    }
    return false;
  }
  async getCsrfToken() {
    const response = await fetch(`${BASE_URL}csrfToken`);
    const responseJson = await response.json();
    return responseJson._csrf;
  }

  async getTrackingToken() {
    const csrf = await this.getCsrfToken();
    const userId = DataHandler.getStore().getState().user.data.user;
    const response = await fetch(`${BASE_URL}d/request-token`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
      }),
      body: '_csrf=' + csrf + '&userId=' + userId, // <-- Post parameters,
    });
    return response.json();
  }

  async independentLogin() {
    try {
      const userCredentials = await this.getGenericPassword();
      const token = await ApiSauce.get(GET_CSRF_TOKEN.route, {}, {}, BASE_URL);

      console.log({token});
      const data = await ApiSauce.post(
        USER_LOGIN.route,
        {
          phone: userCredentials.username,
          password: userCredentials.password,
          _csrf: token._csrf,
        },
        {},
        BASE_URL,
      );

      if (data.email) {
        return token._csrf;
      }
    } catch (error) {
      writeLog(error, 'from Utils line 293');

      return false;
    }

    return false;
  }

  generateGuid() {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  }

  getFormattedAddress({number, postcode, street, town}) {
    const thisNumber = `${number ? `${number}, ` : ``}`;
    const thisTown = `${town ? `${town}, ` : ``}`;
    const thisStreet = `${street ? `${street}, ` : ``}`;
    const thisPostcode = `${postcode ? `${postcode}` : ``}`;

    return `${thisNumber}${thisTown}${thisStreet}${thisPostcode}`;
  }
  sendTrackingToServer(params) {
    console.log('*************Sending force emit request***************');
    console.log({params: params});
    let axiosConfig = {
      headers: {
        Authorization: `bearer ${this.getCurrentUserAccessToken()}`,
      },
    };
    axios
      .post(`${TRACKING_BASE_URL}app/tracking`, params, axiosConfig)
      .then(resp => {
        console.log('*************Emit task Resp***************');
        console.log({resp});
      })
      .catch(error => {
        writeLog(error, 'from Utils line 343');
        console.log('*************Sending force emit error***************');
        console.log({error});
      });
  }
  getUserLocation = async () => {
    /* await BackgroundGeolocation.ready({
      locationAuthorizationRequest: "WhenInUse"
    }); */

    return new Promise(async (resolve, reject) => {
      console.log('this is promise of getUserLocation');
      BackgroundGeolocation.getCurrentPosition(
        {},
        location => {
          console.log({
            // getUserLocation: location.coords,
            getUserLocation: location,
          });
          resolve(location.coords);
        },
        () => {
          console.log('error in getUserLocation');
          if (this.isPlatformAndroid()) this.openSettingModal();
          reject(false);
        },
      );
    });
  };
  taskEmit(id) {
    console.log('************* Force Emit task ' + id + '***************');
    const user = DataHandler.getStore().getState().user.data;
    const params = {};
    params.location = {};
    params.driverDetails = {};
    this.getUserLocation()
      .then(coords => {
        console.log({startTAskCoords: coords});
        params.location.coords = coords;
        params.driverId = user.id;
        params.taskId = id || null;
        params.businessId = user.user.business;
        params.driverDetails.name = user.name;
        params.driverDetails.phone = user.phone;
        params.driverDetails.vehicleSize = user.wheelBase ? user.wheelBase : '';
        this.sendTrackingToServer(params);
      })
      .catch(error => {
        writeLog(error, 'from Utils line 391');
        console.log('current location error' + error);
      });
  }
  distanceInMiles(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dis = R * c;
    return dis.toFixed(1);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  } // function for getting radians from degrees

  getTimer = fromTime => {
    const seconds = moment().diff(moment(fromTime), 'seconds');
    const diff = this.secondsToHms(seconds);
    return diff;
  };

  secondsToHms(seconds) {
    const d = Number(seconds);
    const h = ('0' + Math.floor(d / 3600).toString()).slice(-2);
    const m = ('0' + Math.floor((d % 3600) / 60).toString()).slice(-2);
    const s = ('0' + Math.floor((d % 3600) % 60).toString()).slice(-2);
    return `${h}:${m}:${s}`;
  }

  minsToPresentableText(duration, long = false) {
    const durationHoursText = parseInt(duration / 60);
    const durationMinsText = parseInt(duration % 60);

    return `${
      durationHoursText > 0
        ? `${
            durationHoursText > 1
              ? `${durationHoursText} ${long ? 'hours' : 'hrs'}`
              : `${durationHoursText} ${long ? 'hour' : 'hr'}`
          }`
        : ``
    } ${
      durationMinsText > 0
        ? `${
            durationMinsText > 1
              ? `${durationMinsText} ${long ? 'minutes' : 'mins'}`
              : `${durationMinsText} ${long ? 'minute' : 'min'}`
          }`
        : ``
    }`;
  }

  openSettingModal() {
    Alert.alert(
      'Permission required',
      LOCATION_PERMISSION_DENIED_ERROR2,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => OpenSettings.openSettings(),
        },
      ],
      {cancelable: false},
    );
  }

  async resetGenericPassword() {
    const resetGeneric = await Keychain.resetGenericPassword();
    return resetGeneric;
  }

  async setGenericPassword(phone, password) {
    const setGeneric = await Keychain.setGenericPassword(phone, password);

    return setGeneric;
  }

  async getGenericPassword() {
    const userCredentialss = await Keychain.getGenericPassword();
    return userCredentialss;
  }

  isEven = n => n % 2 == 0;

  isOdd = n => Math.abs(n % 2) == 1;

  penceToPoundsWithDecimal = value => '£' + (value / 100).toFixed(2);
  isRequiredErrorMessage(fieldName) {
    return `${this.capitalizeFirstLetter(fieldName)} is required`;
  }
  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }
  minutesToHours(mins, long = false) {
    return long
      ? `${(mins / 60).toFixed(1)}` + ' hours'
      : `${(mins / 60).toFixed(1)}` + ' h';
  }

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };
  findCoordinates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) return;
    //Instead of navigator.geolocation, just use Geolocation.

    return new Promise(async (resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          console.log({
            getUserLocation: position,
          });
          resolve(position.coords);
        },
        error => {
          console.log(error.code, error.message);
          this.topAlert(
            error.message || ERROR_SOMETHING_WENT_WRONG,
            false,
            'from utils error 5',
          );
        },
        {enableHighAccuracy: true, timeout: 25000, maximumAge: 10000},
      );
    });
  };
  async getDistanceOneToOne(options) {
    console.log('options from util', options);
    const apiHost = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
    if (!options.startPostcode) {
      console.log('No startLocation option provided!');
    }

    if (!options.endPostcode) {
      console.log('No endLocation option provided!');
    }
    var params = {
      key: GOOGLE_API_KEY,
      origins: options.startPostcode,
      destinations: options.endPostcode,
      units: 'imperial',
      mode: _.isUndefined(options.size)
        ? 'driving'
        : options.size === 'cargo'
        ? 'bicycling'
        : 'driving',
    };
    var paramString = `key=${params.key}&origins=${
      params.origins
    }&destinations=${params.destinations}&units=${params.units}&mode=${
      params.mode
    }`;

    if (options.time) {
      paramString += `&departure_time=${
        options.time
      }&traffic_model=pessimistic`;
    }

    let finalApiURL = `${apiHost}${paramString}`;
    console.log({finalApiURL});

    let fetchResult = await fetch(finalApiURL); // call API
    let Result = await fetchResult.json(); // extract json
    console.log(Result);
    return Result.rows[0].elements[0];
  }
  meterToMiles(meter, long = false) {
    return long
      ? `${(meter * 0.00062137119).toFixed(1)} miles`
      : `${(meter * 0.00062137119).toFixed(1)} mi`;
  }

  jobSectionByDate = data => {
    return _.chain(data)
      .groupBy(item => {
        return moment(item.pickup).format('DD MM YYYY');
      })

      .map((value, k) => {
        let today = moment();
        let key = value[0].pickup;
        let isAfterToday = moment(key).isAfter(today, 'day');
        let isBeforeToday = moment(key).isBefore(today, 'day');

        let title = '';
        let diff = moment(key).diff(today, 'days');
        if (isAfterToday) {
          if (diff > 1) title = moment(key).format('DD-MM-YYYY');
          else title = 'Tomorrow';
        } else if (isBeforeToday) {
          if (diff < -1) title = moment(key).format('DD-MM-YYYY');
          else title = 'Yesterday';
        } else {
          title = 'Today';
        }
        return {title: title, data: value};
      })
      .value();
  };

  findObjectInArray(collection, key, value) {
    return !!collection.find(x => x.key === value);
  }

  getFormattedDateTime = (date, format) => {
    if (date) return moment(date).format(format);
    return '';
  };
  tick = current => {
    let total = 0;

    var date1 = moment();
    let date2 = moment.unix(current);
    total = date1.diff(date2) / 1000;
    const hours = this.zeroPad(Math.floor(total / 3600), 10);
    // const hours = Math.floor(total / 3600);
    const minutes = this.zeroPad(Math.floor((total / 60) % 60), 10);
    // const minutes = Math.floor((total / 60) % 60);
    const seconds = this.zeroPad(Math.abs(Math.floor(total % 60)), 10);
    // const seconds = Math.abs(Math.floor(total % 60));
    return hours + ':' + minutes + ':' + seconds;
  };

  dateParser = (date, format = DATE_TIME_FORMAT2) => {
    const isToday = moment().isSame(moment(date), 'day');
    return isToday ? 'Today' : this.getFormattedDateTime(date, format);
  };

  dateParserTwo = date => {
    const isToday = moment().isSame(moment(date), 'day');
    const isTomorrow = moment()
      .add(1, 'day')
      .isSame(moment(date), 'day');

    if (isToday) {
      return `${this.getFormattedDateTime(date, TIME_FORMAT1)} - Today`;
    } else if (isTomorrow) {
      return `${this.getFormattedDateTime(date, TIME_FORMAT1)} - Tomorrow`;
    } else {
      return this.getFormattedDateTime(date, DATE_TIME_FORMAT2);
    }
  };

  dateParserThree = date => {
    const isToday = moment().isSame(moment(date), 'day');
    const isTomorrow = moment()
      .add(1, 'day')
      .isSame(moment(date), 'day');

    if (isToday) {
      return `${this.getFormattedDateTime(date, TIME_FORMAT1)}`;
    } else if (isTomorrow) {
      return `Tom - ${this.getFormattedDateTime(date, TIME_FORMAT1)}`;
    } else {
      return this.getFormattedDateTime(date, TIME_DAY_FORMAT1);
    }
  };

  timeWindowDateParser = date => {
    const isToday = moment().isSame(moment(date), 'day');
    const isTomorrow = moment()
      .add(1, 'day')
      .isSame(moment(date), 'day');

    const isYesterday = moment()
      .subtract(1, 'day')
      .isSame(moment(date), 'day');

    if (isToday) {
      return `${this.getFormattedDateTime(date, TIME_FORMAT1)}`;
    } else if (isTomorrow) {
      return `${this.getFormattedDateTime(date, TIME_FORMAT1)}(Tom)`;
    } else if (isYesterday) {
      return `${this.getFormattedDateTime(date, TIME_FORMAT1)}(Yes)`;
    } else {
      return this.getFormattedDateTime(date, DATE_TIME_FORMAT7);
    }
  };

  zeroPad(nr, base) {
    var len = String(base).length - String(nr).length + 1;
    return len > 0 ? new Array(len).join('0') + nr : nr;
  }
  getTimeInterval = (startTime, endTime) => {
    const diff = Math.ceil(
      moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm')) / 1000,
    );
    const mins = Math.floor(diff / 60);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;

    return `${hours} h : ${remMins} m`;
  };
  getHoursMinutesFromMinutes(minutes) {
    if (minutes > 0) {
      const hours = Math.floor(minutes / 60);
      const remMins = Math.floor(minutes % 60);
      return `${hours < 10 ? '0' + hours : hours}:${
        remMins < 10 ? '0' + remMins : remMins
      }`;
    } else {
      return '--';
    }
  }
  sortBySequence = data => {
    return _.sortBy(data, TASK_FIELDS_NAME.SEQUENCE);
  };
  onlySpaces = str => {
    return /^\s*$/.test(str);
  };
}

export default new Util();
