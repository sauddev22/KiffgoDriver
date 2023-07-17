import React from 'react';
import PropTypes from 'prop-types';
import TaskItemView from './TaskItemView';

export default class TaskItemController extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  static propTypes = {
    item: PropTypes.object.isRequired,
    completed: PropTypes.bool,
  };
  static defaultProps = {
    completed: false,
  };
  render() {
    return <TaskItemView {...this.props} />;
  }
}
