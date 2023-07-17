import _ from 'lodash';
import {Platform} from 'react-native';
import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';
import {updateDeviceTokenRequest} from '../actions/GeneralActions';
import DataHandler from '../services/DataHandler';
import Util from '../util';
import {
  KIFFGO_NOTIFICATION_CHANNEL,
  KIFFGO_NOTIFICATION_CHANNEL_DEFAULT,
  NOTIFICATION_PERMISSION_DENIED_ERROR,
  NOTIFICATION_TYPES,
} from '../constants';
import {writeLog} from '../Helper/loggerHelper';

const updateDeviceToken = async token => {
  let fcmToken = '';
  if (_.isUndefined(token)) {
    fcmToken = await firebase.messaging().getToken();
  }
  console.log('fcmToken', fcmToken || token);
  if (fcmToken || token)
    DataHandler.getStore().dispatch(
      updateDeviceTokenRequest({
        deviceId: fcmToken || token,
        devicePlatform: Platform.OS,
      }),
    );

  return fcmToken || token;
};

const setChannelForAndroid = () => {
  // Driver Channel
  const kiffgoDriverChannel = new firebase.notifications.Android.Channel(
    KIFFGO_NOTIFICATION_CHANNEL.id,
    KIFFGO_NOTIFICATION_CHANNEL.name,
    firebase.notifications.Android.Importance.Max,
  );
  const kiffgoDriverChannelDefault = new firebase.notifications.Android.Channel(
    KIFFGO_NOTIFICATION_CHANNEL_DEFAULT.id,
    KIFFGO_NOTIFICATION_CHANNEL_DEFAULT.name,
    firebase.notifications.Android.Importance.Default,
  );

  firebase.notifications().android.createChannel(kiffgoDriverChannel);
  firebase.notifications().android.createChannel(kiffgoDriverChannelDefault);
};

const getPermissions = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (!enabled) {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      Util.topAlert(NOTIFICATION_PERMISSION_DENIED_ERROR);
      writeLog(error, 'from firebaseHelper line 57');
    }
  }
};

const showLocalNotification = data => {
  const {title, body, type, extraData, notification_time, id} = data;
  const notification = new firebase.notifications.Notification()
    .setNotificationId(Util.generateGuid())
    .setTitle(title)
    .setBody(body)
    .setData({
      type,
      extraData,
      notification_time,
      id,
    });
  notification.ios.setBadge(1);
  notification.id = id;
  notification.android.setAutoCancel(true);

  notification.android.setChannelId(
    type === NOTIFICATION_TYPES.NEW_TASK_ASSIGNED ||
      type === NOTIFICATION_TYPES.INTRANSIT_TASK_UPDATED ||
      type === NOTIFICATION_TYPES.MANY_TASKS_ASSIGNED
      ? KIFFGO_NOTIFICATION_CHANNEL_DEFAULT.id
      : KIFFGO_NOTIFICATION_CHANNEL.id,
  );
  notification.android.setSmallIcon('ic_launcher_push');
  notification.android.setLargeIcon('ic_launcher_push');
  firebase.notifications().displayNotification(notification);
};

const navigateOnNotificationTap = (data, isFreshLaunch = false) => {
  switch (data.type) {
    case NOTIFICATION_TYPES.MARK_AVAILABILITY:
      Actions.jump('availability');
      break;

    // case NOTIFICATION_TYPES.NEW_PRIORITY_JOB:
    //   const extraData = JSON.parse(data.extraData);
    //   Actions.jump('newJobReceiver', {
    //     // eslint-disable-next-line radix
    //     delivery_id: parseInt(extraData.delivery_id),
    //     notification_time: data.notification_time,
    //     // eslint-disable-next-line radix
    //     timeout: parseInt(extraData.timeout),
    //   });
    //   break;

    // case NOTIFICATION_TYPES.JOB_COMING_SOON: {
    //   const extraData = JSON.parse(data.extraData);
    //   Actions.acceptedJobDetails({jobId: parseInt(extraData.delivery_id)});

    //   break;
    // }
    // case NOTIFICATION_TYPES.GOTO_ACCEPTED_JOB_DETAILS: {
    //   const extraData = JSON.parse(data.extraData);
    //   Actions.acceptedJobDetails({jobId: parseInt(extraData.delivery_id)});

    //   break;
    // }
    case NOTIFICATION_TYPES.NEW_TASK_ASSIGNED: {
      Actions.taskDetails({
        taskId: data.task.id,
        uniquestring: data.task.uniquestring,
      });

      break;
    }
    case NOTIFICATION_TYPES.INTRANSIT_TASK_UPDATED: {
      Actions.taskDetails({
        taskId: data.task.id,
        uniquestring: data.task.uniquestring,
      });

      break;
    }

    default:
  }
};

const clearAllNotifications = () => {
  firebase.notifications().removeAllDeliveredNotifications();
};

const clearBadgeNumber = () => {
  if (!Util.isPlatformAndroid()) firebase.notifications().setBadge(0);
};

export {
  updateDeviceToken,
  setChannelForAndroid,
  getPermissions,
  showLocalNotification,
  navigateOnNotificationTap,
  clearBadgeNumber,
  clearAllNotifications,
};
