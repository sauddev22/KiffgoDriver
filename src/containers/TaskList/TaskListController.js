import React from 'react';
import PropTypes from 'prop-types';
import TaskListView from './TaskListView';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import _ from 'lodash';
import {
  userStatusUpdateRequest,
  userStatusUpdateSuccess,
  getUserDataRequest,
  userLogoutRequest,
  changeRouteStatusRequest,
} from '../../actions/UserActions';
import BottomSheet from 'react-native-bottomsheet';

import {
  getTaskListRequest,
  manipulateTaskList,
  getTaskDetailRequest,
  setNewTaskListSequenceRequest,
  dashboardSequenceChanged,
  taskEtaUpdate,
  getFailureReasonRequest,
} from '../../actions/TaskActions';
import util from '../../util';
import {AppState, Platform, Keyboard} from 'react-native';
import {
  startTracking,
  stopTracking,
  startTaskTracking,
} from '../../Helper/trackingHelper';
import {Actions} from 'react-native-router-flux';
import {
  TASK_STATUS,
  NOTIFICATION_TYPES,
  TASK_FIELDS_NAME,
  TASK_LIST_FROM,
  USER_FIELDS_NAME,
  logFileName,
} from '../../constants';
import moment from 'moment-timezone';
import {makeTaskData} from '../../Helper/taskHelper';
import {
  updateDeviceToken,
  setChannelForAndroid,
  getPermissions,
  showLocalNotification,
  navigateOnNotificationTap,
  registerAppWithFCM,
  clearAllNotifications,
} from '../../services/firebaseHelper';
import {
  setSelectedTab,
  getNotificationDataRequest,
  setTaskTab,
  screenStatusRequest,
  uploadSingleImage,
  setNetworkStatus,
  setSyncing,
} from '../../actions/GeneralActions';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';
import {
  uploadLogFiles,
  readLogs,
  createLogFile,
  writeLog,
} from '../../Helper/loggerHelper';
import NetInfo from '@react-native-community/netinfo';
import {syncData} from '../../Helper/syncHelper';

class TaskListController extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      selectedTab: 1,
      taskInTransit: false,
      total: 0,
      success: 0,
      todo: 0,
      fail: 0,
      appState: AppState.currentState,
      comment: '',
      switchState: null,
      fromHelp: false,
      startRouteLoading: false,
      showRouteSheet: true,
      endRouteModalVisible: false,
    };
    TaskListController.instance = this;
  }
  static onExit() {
    if (TaskListController.instance) {
      TaskListController.instance._onExit();
    }
  }

  static onEnter() {
    if (TaskListController.instance) {
      TaskListController.instance._onEnter();
    }
  }
  _onExit() {}

  _onEnter() {
    this.props.setSelectedTab(0);
  }
  static propTypes = {
    getTaskListRequest: PropTypes.func.isRequired,
    taskList: PropTypes.array.isRequired,
  };
  static defaultProps = {};

  static getDerivedStateFromProps(props, state) {
    if (
      props.taskList.length < 1 &&
      props.user[USER_FIELDS_NAME.ROUTE_STARTED]
    ) {
      return {
        endRouteModalVisible: true,
      };
    } else {
      return {
        endRouteModalVisible: false,
      };
    }
  }

  async componentDidMount() {
    readLogs();
    if (!this.props.networkStatus) {
      this.makeListSummary();
    } else {
      this.props.getFailureReasonRequest(() => {});
    }

    let trackingStatus = await getTrackingStatus();
    this.unsubscribe = NetInfo.addEventListener(this._handleConnectivityChange);
    NetInfo.fetch().then(async state => {
      let networkStatus = state.isConnected && state.isInternetReachable;
      if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        if (networkStatus) {
          this._continueNormalFlow();
        } else {
          if (!this.props.user[USER_FIELDS_NAME.ROUTE_STARTED]) {
            this._continueNormalFlow();
          }
        }
      } else {
        trackingStatus = await requestTrackingPermission();
        if (
          trackingStatus === 'authorized' ||
          trackingStatus === 'unavailable'
        ) {
          if (networkStatus) {
            this._continueNormalFlow();
          } else {
            if (!this.props.user[USER_FIELDS_NAME.ROUTE_STARTED]) {
              this._continueNormalFlow();
            }
          }
        } else {
          this.props.userLogoutRequest(status => {
            if (status) {
              stopTracking();
              clearAllNotifications();
              Actions.reset('login');
            }
          });
        }
      }
    });
  }
  _handleConnectivityChange = state => {
    if (state) {
      if (state.isConnected && state.isInternetReachable) {
        if (!this.props.networkStatus) {
          this.props.setNetworkStatus(true);
          console.log('kiffgo connected');
          syncData(true, this._continueNormalFlow);
        }
      } else {
        if (this.props.networkStatus) {
          this.props.setNetworkStatus(false);
          console.log('kiffgo connected !');
        }

        // syncData(false);
      }
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    try {
      this.notificationListener();
      this.notificationOpenedListener();
      this.messageListener();
      this.unsubscribe && this.unsubscribe();
    } catch (error) {
      console.log(error);
      writeLog(error, 'from TaskListController line 134');
    }
  }

  showBottomSheet = status => {
    if (status) {
      if (this.props.user[USER_FIELDS_NAME.BUSINESS].offline_mode && false) {
        this.routeStartBsRef.snapTo(1);
      } else {
        this.routeStartBsRef.snapTo(0);
        createLogFile();
        this.toggleSwitch(true);
      }
    } else {
      if (!this.state.taskInTransit) {
        if (this.props.user[USER_FIELDS_NAME.ROUTE_STARTED]) {
          this.routeEndBsRef.snapTo(1);
        } else {
          this.setState({switchState: status}, () => {
            this.setState({loading: true});
            uploadLogFiles(
              this.uploadLogFileCallback,
              this.state.switchState,
              this.state.comment,
              this.state.fromHelp,
            );
          });
        }
      } else {
        util.topAlert(
          'You must complete your active task before going off duty',
          true,
        );
      }
    }
  };

  startRouteSheetSubmit = startRoute => {
    this.setState({startRouteLoading: true});
    this.props.changeRouteStatusRequest({route_started: startRoute}, status => {
      this.setState({startRouteLoading: false});
      if (status) {
        // this.closeEndRouteModal();
        if (this.props.user[USER_FIELDS_NAME.ROUTE_STARTED]) {
          this.routeStartBsRef.snapTo(0);
          createLogFile();
          this.toggleSwitch(true);
        } else {
          this.setState({loading: true});
          this.routeEndBsRef.snapTo(0);
          uploadLogFiles(
            this.uploadLogFileCallback,
            false,
            this.state.comment,
            this.state.fromHelp,
          );
        }
      }
    });
  };

  showHelpSheet = () => {
    this.setState({fromHelp: true}, () => {
      this.bsRef.snapTo(1);
    });
  };

  fileBottomSheetSubmit = () => {
    Keyboard.dismiss();
    this.setState({loading: true});
    uploadLogFiles(
      this.uploadLogFileCallback,
      this.state.switchState,
      this.state.comment,
      this.state.fromHelp,
    );
  };

  uploadLogFileCallback = value => {
    this.bsRef.snapTo(0);
    this.setState({comment: '', switchState: ''});
    if (!this.state.fromHelp) {
      this.toggleSwitch(value);
    } else {
      this.setState({loading: false, fromHelp: false});
    }
  };
  toggleSwitch = value => {
    this.props.userStatusUpdateSuccess({
      status: value ? 'ACTIVE' : 'INACTIVE',
    });
    const payload = {
      status: value,
    };
    stopTracking();
    this.props.userStatusUpdateRequest(payload, status => {
      readLogs();
      if (status) {
        payload.status ? this._checkTaskInTransit(true) : stopTracking();
      } else {
        this.props.userStatusUpdateSuccess({
          status: !value ? 'ACTIVE' : 'INACTIVE',
        });
        startTracking('toggleSwitch');
      }
    });
    this._getData(false);
  };

  _continueNormalFlow = () => {
    if (this.props.user[USER_FIELDS_NAME.IS_ONLINE]) {
      startTracking('_continueNormalFlow');
      this._getData(false);
    }
    this._fcmInit();
    AppState.addEventListener('change', this._handleAppStateChange);
  };

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      console.log('<<<<<<<<<<<<<<<< ON >>>>>>>>>>>>>>>>.');
      if (this.props.user[USER_FIELDS_NAME.IS_ONLINE]) {
        if (this.props.networkStatus) {
          this.props.getUserDataRequest();
          this._getDataNoLoad(false);
          this._changeScreenStatus(true);
        } else {
          if (!this.props.user[USER_FIELDS_NAME.ROUTE_STARTED]) {
            this.props.getUserDataRequest();
            this._getDataNoLoad(false);
            this._changeScreenStatus(true);
          }
        }
      }
    } else {
      if (this.props.networkStatus) {
        this._changeScreenStatus(false);
      } else {
        if (!this.props.user[USER_FIELDS_NAME.ROUTE_STARTED]) {
          this._changeScreenStatus(false);
        }
      }
    }
    this.setState({appState: nextAppState});
  };
  _checkTaskInTransit = (startTrackingFlag = false) => {
    let task = util.isTaskInTransit();
    let taskInTransit = !_.isEmpty(task);
    if (this.props.user[USER_FIELDS_NAME.IS_ONLINE]) {
      if (taskInTransit) {
        // stopTracking(' TaskListController _checkTaskInTransit');
        setTimeout(() => {
          startTaskTracking(task[TASK_FIELDS_NAME.TASK_NUMBER]);
        }, 500);
      } else {
        if (startTrackingFlag) {
          startTracking('_checkTaskInTransit');
        }
      }
    }
    this.setState({taskInTransit});
  };
  _changeScreenStatus = status => {
    const payload = {
      screenStatus: status,
    };
    this.props.screenStatusRequest(payload, () => {
      console.log('request done');
    });
  };
  _fcmInit = async () => {
    // ------------- CHANNEL INIT --------------
    if (util.isPlatformAndroid()) setChannelForAndroid();

    // ------------- iOS Permission --------------
    if (!util.isPlatformAndroid()) getPermissions();

    // ------------- TOKEN INIT --------------

    updateDeviceToken();

    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(fcmToken => {
        updateDeviceToken(fcmToken);
      });

    // ------------- NOTIFICATION LISTNER --------------

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // when app is in background
        // console.log({ background: notificationOpen });

        if (notificationOpen && notificationOpen.notification) {
          this.notificationTap(notificationOpen.notification._data);
        }
      });

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        // when app is in foreground;
        console.log({foregroundNotification: notification});
        if (notification) {
          this.manipulateNotifications(notification._data, true);
        }
      });

    this.messageListener = firebase
      .messaging()
      .onMessage((message: RemoteMessage) => {
        // Process your message as required
        if (message) {
          this.manipulateNotifications(message._data, false);
        }
      });
    //when app i skilled
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      console.log('getInitialNotification', notificationOpen);
      if (notificationOpen && notificationOpen.notification) {
        this.notificationTap(notificationOpen.notification._data, true);
      }
    }
  };
  notificationTap = (data, isFreshLaunch = false) => {
    if (!isFreshLaunch) {
      this._getDataNoLoad(true);
    }
    if (
      data.type === NOTIFICATION_TYPES.NEW_TASK_ASSIGNED ||
      data.type === NOTIFICATION_TYPES.INTRANSIT_TASK_UPDATED
    ) {
      const payload = {notificationKey: data.extraData};
      this.props.getNotificationDataRequest(
        payload,
        (status, notificationData) => {
          if (status) {
            if (notificationData.task.length > 0) {
              const newData = {
                task: notificationData.task[0],
                type: data.type,
              };
              navigateOnNotificationTap(newData);
            }
          }
        },
      );
    }
  };
  manipulateNotifications = (notification_data, isNotification) => {
    if (
      notification_data.type === NOTIFICATION_TYPES.DRIVER_IS_INACTIVE ||
      notification_data.type === NOTIFICATION_TYPES.DRIVER_IS_INACTIVE_AUTO
    ) {
      if (!this.state.taskInTransit) {
        this.props.userStatusUpdateSuccess(false);
        if (isNotification) {
          showLocalNotification(notification_data);
        }
        stopTracking();
      }
    } else {
      console.log({notificationType: notification_data.type});
      const payload = {notificationKey: notification_data.extraData};

      this.props.getNotificationDataRequest(payload, (status, data) => {
        if (status) {
          if (
            notification_data.type === NOTIFICATION_TYPES.NEW_TASK_ASSIGNED ||
            notification_data.type === NOTIFICATION_TYPES.MANY_TASKS_ASSIGNED
          ) {
            if (data.task.length >= 1) {
              const tasks_list = makeTaskData(data.task);
              let sequence = [];

              if (data.sequenceData && !_.isNil(data.sequenceData.tasks)) {
                sequence = data.sequenceData.tasks;
              }

              this.props.manipulateTaskList(
                {tasks_list, sequence},
                NOTIFICATION_TYPES.NEW_TASK_ASSIGNED,
              );
              setTimeout(() => {
                this.makeListSummary();
              }, 1000);
              if (isNotification) {
                showLocalNotification(notification_data);
              }
            } else {
              console.log('error getting task details');
            }
          }
          if (
            notification_data.type === NOTIFICATION_TYPES.TASK_UPDATED ||
            notification_data.type === NOTIFICATION_TYPES.INTRANSIT_TASK_UPDATED
          ) {
            let tasks = makeTaskData(data.task);

            this.props.manipulateTaskList(
              tasks,
              NOTIFICATION_TYPES.TASK_UPDATED,
            );
            setTimeout(() => {
              this.makeListSummary();
            }, 1000);
            if (
              notification_data.type ===
              NOTIFICATION_TYPES.INTRANSIT_TASK_UPDATED
            ) {
              showLocalNotification(notification_data);
            }
          }

          if (
            notification_data.type === NOTIFICATION_TYPES.TASK_UNASSIGNED ||
            notification_data.type === NOTIFICATION_TYPES.TASK_DELETED
          ) {
            this.props.manipulateTaskList(
              data.task,
              NOTIFICATION_TYPES.TASK_UNASSIGNED,
            );
            if (isNotification) {
              showLocalNotification(notification_data);
            }
            setTimeout(() => {
              this.makeListSummary();
            }, 1000);
          }
          if (
            notification_data.type === NOTIFICATION_TYPES.TASK_SEQUENCE_CHANGED
          ) {
            this.props.dashboardSequenceChanged(data.tasks);
          }
          console.log(this.props.taskList);
          if (notification_data.type === NOTIFICATION_TYPES.TASK_ETA_UPDATED) {
            console.log(util.dateParserThree(data.eta));
            console.log({uniquestring: data.uniquestring});
            console.log({data});
            this.props.taskEtaUpdate(data);
          }
        }
      });
    }
  };

  makeListSummary = () => {
    let total = 0,
      success = 0,
      todo = 0,
      fail = 0;
    if (this.props.selectedTab === 1) {
      this.props.taskList.forEach(element => {
        if (element.completeAfter) {
          const taskDate = moment(element.completeAfter);
          const today = moment();
          const isToday = taskDate.isSame(today, 'd');
          if (isToday) {
            if (element.status === TASK_STATUS.FAIL) {
              fail += 1;
            } else if (element.status === TASK_STATUS.SUCCESS) {
              success += 1;
            } else if (
              element.status === TASK_STATUS.ASSIGNED ||
              element.status === TASK_STATUS.IN_TRANSIT
            ) {
              todo += 1;
            }
            total += 1;
          }
        } else {
          if (element.status === TASK_STATUS.FAIL) {
            fail += 1;
          } else if (element.status === TASK_STATUS.SUCCESS) {
            success += 1;
          } else if (
            element.status === TASK_STATUS.ASSIGNED ||
            element.status === TASK_STATUS.IN_TRANSIT
          ) {
            todo += 1;
          }
          total += 1;
        }
      });
    } else {
      this.props.taskList.forEach(element => {
        if (element.status === TASK_STATUS.FAIL) {
          fail += 1;
        } else if (element.status === TASK_STATUS.SUCCESS) {
          success += 1;
        } else if (
          element.status === TASK_STATUS.ASSIGNED ||
          element.status === TASK_STATUS.IN_TRANSIT
        ) {
          todo += 1;
        }
        total += 1;
      });
    }

    this.setState({total, success, todo, fail});
  };
  _getData = (startTrackingFlag = false) => {
    this.setState({loading: true});

    this.props.getTaskListRequest({}, status => {
      this.setState({loading: false});
      if (status) {
        this.makeListSummary();
        this._checkTaskInTransit(startTrackingFlag);
      }
    });
  };
  _getDataNoLoad = (startTrackingFlag = false) => {
    console.log('_getDataNoLoad');

    this.props.getTaskListRequest({}, status => {
      if (status) {
        console.log('_getDataNoLoad resp true');

        this.makeListSummary();
        this._checkTaskInTransit(startTrackingFlag);
      }
    });
  };

  tabClick = tab => {
    this.props.setTaskTab(tab);
    setTimeout(() => {
      this.makeListSummary();
      try {
        this.flatListRef.scrollToIndex({
          animated: true,
          index: 0,
        });
      } catch (error) {
        console.log({error});
        writeLog(error, 'from TaskListController line 507');
      }
    }, 200);
  };
  onDragDone = (data, from, to) => {
    if (from != to) {
      this.setState({loading: true});
      let after = {};
      let before = {};
      if (to !== data.length - 1) {
        after = data[to + 1];
      }

      if (to !== 0) {
        before = data[to - 1];
      }
      if (
        after[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.ASSIGNED ||
        before[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.ASSIGNED
      ) {
        console.log('good drop');
        let newSequence = null;
        if (to > from) {
          newSequence = data[to - 1][TASK_FIELDS_NAME.SEQUENCE];
        } else {
          newSequence = data[to + 1][TASK_FIELDS_NAME.SEQUENCE];
        }
        const payload = {};
        payload.sequence = newSequence;
        payload.task = data[to][TASK_FIELDS_NAME.TASK_NUMBER];
        this.props.setNewTaskListSequenceRequest(payload, status => {
          this.setState({loading: false});
          if (status) {
          }
        });
      } else {
        console.log('bad drop');
        this.setState({loading: false});
      }
    }
  };
  onFileSheetStateChange = show => {
    this.setState({
      showRouteSheet: show,
    });
  };
  closeEndRouteModal = () => {
    this.setState({endRouteModalVisible: false});
  };
  render() {
    const {
      total,
      success,
      todo,
      fail,
      loading,
      comment,
      startRouteLoading,
      showRouteSheet,
      endRouteModalVisible,
    } = this.state;
    return (
      <TaskListView
        {...this.props}
        flatListRef={ref => {
          this.flatListRef = ref;
        }}
        bsRef={ref => {
          if (ref) this.bsRef = ref;
        }}
        routeStartBsRef={ref => {
          if (ref) this.routeStartBsRef = ref;
        }}
        routeEndBsRef={ref => {
          if (ref) this.routeEndBsRef = ref;
        }}
        total={total}
        success={success}
        todo={todo}
        fail={fail}
        loading={loading}
        comment={comment}
        startRouteLoading={startRouteLoading}
        showRouteSheet={showRouteSheet}
        endRouteModalVisible={endRouteModalVisible}
        toggleSwitch={this.showBottomSheet}
        onDragDone={this.onDragDone}
        tabClick={this.tabClick}
        fileBottomSheetSubmit={this.fileBottomSheetSubmit}
        showHelpSheet={this.showHelpSheet}
        startRouteSheetSubmit={this.startRouteSheetSubmit}
        onFileSheetStateChange={this.onFileSheetStateChange}
        closeEndRouteModal={this.closeEndRouteModal}
        onCommentTextChange={text => {
          if (text.length <= 500) {
            this.setState({comment: text});
          }
        }}
      />
    );
  }
}
const mapStateToProps = ({user, task, general}) => {
  return {
    user: user.data,
    taskList: util.sortBySequence(task.tasks),
    from: general.from,
    selectedTab: general.selectedTaskTab,
    networkStatus: general.networkStatus,
    isSyncing: general.isSyncing,
  };
};
const actions = {
  getTaskListRequest,
  userStatusUpdateRequest,
  userStatusUpdateSuccess,
  manipulateTaskList,
  getTaskDetailRequest,
  setSelectedTab,
  setNewTaskListSequenceRequest,
  dashboardSequenceChanged,
  taskEtaUpdate,
  getNotificationDataRequest,
  setTaskTab,
  getUserDataRequest,
  screenStatusRequest,
  userLogoutRequest,
  uploadSingleImage,
  setNetworkStatus,
  changeRouteStatusRequest,
  setSyncing,
  getFailureReasonRequest,
};
export default connect(
  mapStateToProps,
  actions,
)(TaskListController);
