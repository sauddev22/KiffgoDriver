import {TRACKING_AUTH} from '../config/WebService';
import {TRACKING_SECRETE_KEY} from '../constants/index';
import BackgroundGeolocation from 'react-native-background-geolocation';
import util from '../util';
import DataHandler from '../services/DataHandler';
import _ from 'lodash';
import {TRACKING_BASE_URL} from '../config/WebService';
import DeviceVersion from 'react-native-device-info';
let TRACKING_TOKEN = '';
let HIGH_PARAMS = {driverDetails: {}};
let LOW_PARAMS = {driverDetails: {}};
let TRACKING_PARAMS = {driverDetails: {}};
let TASK_TRACKING_PARAMS = {driverDetails: {}};
let HEART_BEAT_PARAMS = {};

const updateToken = async token => {
  let tempTrackingParams = _.cloneDeep(TRACKING_PARAMS);
  let tempTaskTrackingParams = _.cloneDeep(TASK_TRACKING_PARAMS);
  tempTrackingParams.token = token;
  tempTaskTrackingParams.token = token;
  TRACKING_PARAMS = tempTrackingParams;
  TASK_TRACKING_PARAMS = tempTaskTrackingParams;
  const headers = {};
  headers.authorization = `bearer ${token}`;
  console.log({headers});
  BackgroundGeolocation.setConfig({headers: headers});
};
const stopTaskTracking = () => {
  console.log(
    '*****************************************************************',
  );
  console.log('stop Task Tracking');

  console.log(
    '*****************************************************************',
  );
  const stopNewParams = _.cloneDeep(TRACKING_PARAMS);
  stopNewParams.taskId = null;
  console.log({stopTaskTrackingParams: stopNewParams});
  BackgroundGeolocation.setConfig({params: stopNewParams}).then(state => {
    TRACKING_PARAMS = stopNewParams;
    console.log({stopState: state});
  });
};
const startTracking = async from => {
  console.log('*****************************');
  console.log('*******START TRACKING from ' + from + '********');
  console.log('*****************************');
  let tempParams = _.cloneDeep(TRACKING_PARAMS);
  tempParams.token = util.getCurrentUserAccessToken();
  tempParams.secretKey = TRACKING_SECRETE_KEY;
  const user = DataHandler.getStore().getState().user.data;
  tempParams.driverId = user.id;
  tempParams.taskId = null;
  tempParams.businessId = user.user.business;
  tempParams.driverDetails.name = user.name;
  tempParams.driverDetails.phone = user.phone;
  tempParams.driverDetails.vehicleSize = user.wheelBase ? user.wheelBase : '';
  let deviceInfo = await BackgroundGeolocation.getDeviceInfo();
  tempParams.deviceInfo = deviceInfo;
  tempParams.appVersion = DeviceVersion.getVersion();
  TRACKING_PARAMS = tempParams;

  const BG_LOCATION_DEFAULT_PARAMS = {
    locationAuthorizationRequest: 'Always',
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    stopOnTerminate: false,
    enableHeadless: true,
    startOnBoot: true,
    foregroundService: true,
    autoSync: true,
    debug: false,
    scheduleUseAlarmManager: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_DEBUG,
    preventSuspend: true,
    heartbeatInterval: 120,
  };
  BackgroundGeolocation.onHttp(async data => {
    console.log({httpDataParams: TRACKING_PARAMS});
    console.log({httpData: data});
    if (!data.success) {
      console.log({data});
      console.log('Not success ');
      let newToke = await util.refreshAccessToken();
      console.log('setting new headers', {newToke});
      const headers = {};
      headers.authorization = `bearer ${newToke}`;
      console.log({headers});
      BackgroundGeolocation.setConfig({headers: headers});
    }
  });

  BackgroundGeolocation.ready(
    {
      backgroundPermissionRationale: {
        title:
          "Allow {applicationName} to access to this device's location in the background?",
        // title: 'Background Location Access',
        // message:'Kiffgo driver collects location data to enable the real-time delivery ETA calculation while the driver is "on-duty." We do not access, collect, or store location information from a driver\'s mobile device when they are off-duty or offline.',
        message:
          '{applicationName} collects location data to enable the real-time delivery ETA calculation even when the app is closed or not in use while the driver is "on-duty." We do not access, collect, or store location information from a driver\'s mobile device when they are off-duty or offline., please enable {backgroundPermissionOptionLabel} location permission',
        positiveAction: 'Change to {backgroundPermissionOptionLabel}',
        negativeAction: 'Cancel',
      },
      ...BG_LOCATION_DEFAULT_PARAMS,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      url: `${TRACKING_BASE_URL}app/tracking`,
      headers: {
        authorization: `bearer ${util.getCurrentUserAccessToken()}`,
      },
      params: TRACKING_PARAMS,
    },

    state => {
      console.log({state});
      if (!state.enabled) {
        BackgroundGeolocation.start(state => {
          if (state.enabled) {
            BackgroundGeolocation.changePace(true);
          }
          console.log('- Configure success: ', state);
        });
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        );
      } else {
        // util.topAlert('Tracking already enabled', true);
      }
    },
  );
};

const startTaskTracking = async taskId => {
  let tempParams = _.cloneDeep(TASK_TRACKING_PARAMS);
  tempParams.token = util.getCurrentUserAccessToken();
  tempParams.secretKey = TRACKING_SECRETE_KEY;
  const user = DataHandler.getStore().getState().user.data;
  tempParams.driverId = user.id;
  tempParams.taskId = taskId;
  tempParams.businessId = user.user.business;
  tempParams.driverDetails.name = user.name;
  tempParams.driverDetails.phone = user.phone;
  tempParams.driverDetails.vehicleSize = user.wheelBase ? user.wheelBase : '';
  let deviceInfo = await BackgroundGeolocation.getDeviceInfo();
  tempParams.deviceInfo = deviceInfo;
  tempParams.appVersion = DeviceVersion.getVersion();
  TASK_TRACKING_PARAMS = tempParams;

  const BG_LOCATION_DEFAULT_PARAMS = {
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    stopOnTerminate: false,
    enableHeadless: true,
    startOnBoot: true,
    foregroundService: true,
    autoSync: true,
    debug: false,
    scheduleUseAlarmManager: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_DEBUG,
    preventSuspend: true,
    heartbeatInterval: 120,
  };
  BackgroundGeolocation.onHttp(async data => {
    console.log({httpDataParamsTaskTracking: TASK_TRACKING_PARAMS});
    console.log({httpDataTaskTracking: data});
    if (!data.success) {
      console.log({data});
      console.log('Not success TaskTracking');
      let newToke = await util.refreshAccessToken();
      console.log('setting new headers TaskTracking', {newToke});
      const headers = {};
      headers.authorization = `bearer ${newToke}`;
      console.log({headers});
      BackgroundGeolocation.setConfig({headers: headers});
    }
  });
  BackgroundGeolocation.ready(
    {
      ...BG_LOCATION_DEFAULT_PARAMS,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      url: `${TRACKING_BASE_URL}app/tracking`,
      headers: {
        authorization: `bearer ${util.getCurrentUserAccessToken()}`,
      },
      params: TASK_TRACKING_PARAMS,
    },

    state => {
      console.log({state});
      if (!state.enabled) {
        BackgroundGeolocation.start(state => {
          if (state.enabled) {
            BackgroundGeolocation.changePace(true);
          }
          console.log('- Configure success: ', state);
        });
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        );
      } else {
        // util.topAlert('Tracking already enabled', true);
      }
    },
  );
};

const stopTracking = async from => {
  console.log(
    '*****************************************************************',
  );
  console.log('Stop tracking from' + from);

  console.log(
    '*****************************************************************',
  );
  await BackgroundGeolocation.reset();
  await BackgroundGeolocation.stopSchedule();
  await BackgroundGeolocation.stop();
  TASK_TRACKING_PARAMS = {driverDetails: {}};
  TRACKING_PARAMS = {driverDetails: {}};
};
export {
  startTracking,
  stopTracking,
  startTaskTracking,
  stopTaskTracking,
  updateToken,
};

// const starLowLevelTracking = () => {
//   util.getTrackingToken().then(resp => {
//     if (resp.status) {
//       console.log(
//         '*****************************************************************',
//       );
//       console.log('Starting LOW level');

//       console.log(
//         '*****************************************************************',
//       );
//       let HEART_BEAT_PARAMS = {};
//       let tempParams = _.cloneDeep(LOW_PARAMS);
//       tempParams.token = resp.data[0].accessToken;
//       tempParams.secretKey = TRACKING_SECRETE_KEY;
//       const user = DataHandler.getStore().getState().user.data;

//       tempParams.userId = user.user;
//       tempParams.driverDetails.name = user.firstName + ' ' + user.lastName;
//       tempParams.driverDetails.phone = user.phone;
//       tempParams.driverDetails.vehicleSize = user.wheelBase
//         ? user.wheelBase
//         : '';
//       LOW_PARAMS = tempParams;
//       const BG_LOCATION_DEFAULT_PARAMS = {
//         desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
//         distanceFilter: 100,
//         stopOnTerminate: false,
//         enableHeadless: true,
//         startOnBoot: true,
//         foregroundService: true,
//         autoSync: true,
//         debug: false,
//         scheduleUseAlarmManager: true,
//         logLevel: BackgroundGeolocation.LOG_LEVEL_DEBUG,
//         preventSuspend: true,
//         heartbeatInterval: 60,
//       };
//       BackgroundGeolocation.onHttp(data => {
//         console.log({httpDataParams: tempParams});
//         console.log({httpData: data});
//         if (!data.success) {
//           console.log('Not success ');
//           util.getTrackingToken().then(resp => {
//             if (resp.status) {
//               console.log('setting new parems');
//               const newParams = _.cloneDeep(LOW_PARAMS);
//               newParams.token = resp.data[0].accessToken;
//               console.log({newParams});

//               BackgroundGeolocation.setConfig({params: newParams});
//             }
//           });
//         }
//       });

//       BackgroundGeolocation.ready(
//         {
//           ...BG_LOCATION_DEFAULT_PARAMS,
//           url: `${TRACKING_BASE_URL}tracking`,
//           headers: {
//             authorization: `bearer ${TRACKING_AUTH}`,
//           },
//           params: LOW_PARAMS,
//           schedule: ['1-7 00:15-23:45'],
//         },
//         state => {
//           console.info('- Scheduler starting');
//           BackgroundGeolocation.startSchedule();
//           BackgroundGeolocation.onSchedule(state => {
//             let enabled = state.enabled;
//             if (enabled) {
//               BackgroundGeolocation.changePace(true);
//             }
//             console.log('[onSchedule] - enabled? ', enabled);
//           });
//           // state => {
//           //   if (state.enabled) {
//           //     console.log('change pace');
//           //     BackgroundGeolocation.changePace(true);
//           //   }
//           //   console.info('- Scheduler started', state);
//           // }
//         },
//       );
//     } else {
//       // util.topAlert('Unable to get Tracking token', true);
//     }
//   });
// };
