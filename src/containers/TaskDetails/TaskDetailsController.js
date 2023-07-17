import React from 'react';
import PropTypes from 'prop-types';
import TaskDetailsView from './TaskDetailsView';
import {connect} from 'react-redux';
import {TASK_FIELDS_NAME, TASK_STATUS, USER_FIELDS_NAME} from '../../constants';
import _ from 'lodash';
import BottomSheet from 'react-native-bottomsheet';
import {Linking, Platform, Alert} from 'react-native';
import {
  startTaskRequest,
  getTaskDetailRequest,
} from '../../actions/TaskActions';
import {changeRouteStatusRequest} from '../../actions/UserActions';
import {Actions} from 'react-native-router-flux';
import util from '../../util';
import {startTaskTracking, stopTracking} from '../../Helper/trackingHelper';

class TaskDetailsController extends React.Component {
  constructor(props) {
    super();
    this.state = {
      taskInTransit: false,
      loading: false,
      requestPending: false,
      startRouteModalVisible: false,

      startRouteLoading: false,
    };
  }

  static propTypes = {
    taskId: PropTypes.number.isRequired,
  };
  static defaultProps = {
    task: null,
  };
  componentDidMount() {
    this._checkTaskInTransit();
    if (!this.props.task) {
      this.setState({requestPending: true});
      let payload = {taskArray: [this.props.uniquestring]};
      this.props.getTaskDetailRequest(payload, status => {
        if (!status) {
          this.alertGoBack();
        }
        console.log(status);
        this.setState({requestPending: false});
      });
    }
  }
  alertGoBack = () => {
    Alert.alert(
      '',
      'This task has been unassigned or completed by a dispatcher.',
      [
        {
          text: 'Ok',
          onPress: () => {
            Actions.pop();
          },
        },
      ],
      {cancelable: false},
    );
  };
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.task === null && !this.state.requestPending) {
      this.alertGoBack();
    }
  }
  _checkTaskInTransit = () => {
    let task = util.isTaskInTransit();
    let taskInTransit = !_.isEmpty(task);
    this.setState({taskInTransit});
  };
  _onLocationButton = () => {
    this.mapSheetRef.open();
  };
  mapClick = () => {
    this.mapSheetRef.close();
  };

  _onLongPressButton = callbackFunc => {
    if (
      this.props.user[USER_FIELDS_NAME.BUSINESS].offline_mode &&
      !this.props.user[USER_FIELDS_NAME.ROUTE_STARTED]
    ) {
      console.log('here');
      this.setState({startRouteModalVisible: true});
    } else {
      util.showLoader(this);
      const payload = {
        task: this.props.task[TASK_FIELDS_NAME.TASK_NUMBER],
      };
      this.props.startTaskRequest(payload, status => {
        util.hideLoader(this);
        if (status) {
          util.taskEmit(payload.task);
          stopTracking('TaskDetailsController _onLongPressButton');
          setTimeout(() => {
            startTaskTracking(this.props.task[TASK_FIELDS_NAME.TASK_NUMBER]);
          }, 2000);
          try {
            callbackFunc();
          } catch (error) {
            console.log('callbackFunc not found  >>> ' + error);
          }
        }
      });
    }
  };
  openDialScreen = () => {
    let number = '';
    if (util.isPlatformAndroid()) {
      number = `tel:+${this.props.task[TASK_FIELDS_NAME.RECIPIENT_PHONE]}`;
    } else {
      number = `tel:${this.props.task[TASK_FIELDS_NAME.RECIPIENT_PHONE]}`;
    }
    Linking.openURL(number).catch(err =>
      console.error('An error occurred', err),
    );
  };
  startTaskAndNavigate = () => {
    const {taskInTransit} = this.state;
    const {task} = this.props;
    if (task[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.ASSIGNED) {
      BottomSheet.showBottomSheetWithOptions(
        {
          options: ['Start Task and Navigate', 'Navigate', 'Cancel'],
          title:
            'This task has not been started. would you like to start the task and navigate?',
          dark: true,
          cancelButtonIndex: 2,
        },
        value => {
          if (value === 0) {
            this._onLongPressButton(this._onLocationButton);
          }
          if (value === 1) {
            this._onLocationButton();
          }
        },
      );
    } else {
      this._onLocationButton();
    }
  };
  startRouteRequest = startTaskCallback => {
    this.setState({startRouteLoading: true});
    this.props.changeRouteStatusRequest({route_started: true}, status => {
      this.setState({startRouteLoading: false});
      if (status) {
        this.closeRouteModal();
        this._onLongPressButton();
      }
    });
  };

  closeRouteModal = () => {
    this.setState({startRouteModalVisible: false});
  };
  render() {
    return (
      <TaskDetailsView
        {...this.props}
        loading={this.state.loading}
        startRouteModalVisible={this.state.startRouteModalVisible}
        startRouteLoading={this.state.startRouteLoading}
        onLongPressButton={this._onLongPressButton}
        mapSheetRef={ref => {
          this.mapSheetRef = ref;
        }}
        mapClick={this.mapClick}
        startTaskAndNavigate={this.startTaskAndNavigate}
        openDialScreen={this.openDialScreen}
        taskInTransit={this.state.taskInTransit}
        startRouteRequest={this.startRouteRequest}
        closeRouteModal={this.closeRouteModal}
      />
    );
  }
}
const mapStateToProps = ({task, user}, props) => {
  if (props.completed) {
    task = _.find(task.taskHistory, {id: props.taskId});
  } else {
    task = _.find(task.tasks, {id: props.taskId});
  }

  return {task, user: user.data};
};
const actions = {
  startTaskRequest,
  getTaskDetailRequest,
  changeRouteStatusRequest,
};
export default connect(
  mapStateToProps,
  actions,
)(TaskDetailsController);
