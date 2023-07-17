import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getTaskListRequest} from '../../actions/TaskActions';
import TaskHistoryView from './TaskHistoryView';
import util from '../../util';
import {TASK_STATUS} from '../../constants';

class TaskHistoryController extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }
  static propTypes = {
    getTaskListRequest: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  componentDidMount() {
    if (this.props.networkStatus) {
      this._getData();
    } else {
      this.setState({loading: false});
    }
  }

  _getData = () => {
    this.setState({loading: true});
    this.props.getTaskListRequest({completed: true}, status => {
      this.setState({loading: false});
      if (status) {
      }
    });
  };

  render() {
    return (
      <TaskHistoryView
        {...this.props}
        getData={this._getData}
        loading={this.state.loading}
      />
    );
  }
}
const mapStateToProps = ({task, general}) => {
  let taskListNew = util.sortBySequence(task.taskHistory);

  return {
    taskList: taskListNew,
    networkStatus: general.networkStatus,
  };
};
const actions = {
  getTaskListRequest,
};
export default connect(
  mapStateToProps,
  actions,
)(TaskHistoryController);
