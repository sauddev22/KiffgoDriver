import React from 'react';
import PropTypes from 'prop-types';
import FailureReasonView from './FailureReasonView';
import {connect} from 'react-redux';
import {
  getFailureReasonRequest,
  updateTask,
} from '../../../actions/TaskActions';
import util from '../../../util';
import {TASK_FIELDS_NAME} from '../../../constants';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';

class FailureReasonController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selected: '',
      previousReason: props.myTask[TASK_FIELDS_NAME.REASON],
    };
  }
  static propTypes = {
    getFailureReasonRequest: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    myTask: PropTypes.object.isRequired,
    reasons: PropTypes.array.isRequired,
  };
  static defaultProps = {};
  componentDidMount() {
    if (this.props.networkStatus) {
      this.getData();
    }
  }
  getData = () => {
    util.showLoader(this);
    this.props.getFailureReasonRequest(() => {
      util.hideLoader(this);
    });
  };
  initialSelected = () => {
    const {myTask, reasons} = this.props;
    reasons.forEach(({element}) => {
      if (element.failure_reason === myTask[TASK_FIELDS_NAME.REASON]) {
        this.setState({selected: element.failure_reason});
      }
    });
  };
  setSelected = failure_reason => {
    const newTask = _.cloneDeep(this.props.myTask);
    newTask[TASK_FIELDS_NAME.REASON] = failure_reason;
    this.props.updateTask(newTask);
  };
  onCancelPress = () => {
    const newTask = _.cloneDeep(this.props.myTask);
    newTask[TASK_FIELDS_NAME.REASON] = this.state.previousReason;
    this.props.updateTask(newTask);
    Actions.pop();
  };
  onSavePress = () => {
    if (this.props.myTask[TASK_FIELDS_NAME.REASON] === '') {
      util.topAlert('Select a reason', true);
    } else {
      const newTask = _.cloneDeep(this.props.myTask);
      newTask[TASK_FIELDS_NAME.IS_SUCCESS] = false;
      this.props.updateTask(newTask);
      Actions.pop();
    }
  };
  render() {
    return (
      <FailureReasonView
        {...this.props}
        setSelected={this.setSelected}
        loading={this.state.loading}
        onCancelPress={this.onCancelPress}
        onSavePress={this.onSavePress}
      />
    );
  }
}
const mapStateToProps = ({task, general}, props) => {
  let myTask = _.find(task.tasks, {id: props.taskId});
  let reasons = task.reasons;
  let networkStatus = general.networkStatus;

  return {myTask, reasons, networkStatus};
};
const actions = {getFailureReasonRequest, updateTask};
export default connect(
  mapStateToProps,
  actions,
)(FailureReasonController);
