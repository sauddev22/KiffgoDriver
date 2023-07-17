import React from 'react';
import PropTypes from 'prop-types';
import StartEndTimeView from './StartEndTimeView';

export default class StartEndTimeController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startIndexState: props.startIndex,
      endIndexState: props.endIndex,
    };
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    startIndex: PropTypes.number.isRequired,
    endIndex: PropTypes.number.isRequired,
    cancelCallback: PropTypes.func.isRequired,
    timeUpdateDone: PropTypes.func.isRequired,
    dayLoading: PropTypes.bool,
  };
  static defaultProps = {};
  timeUpdate = data => {
    console.log({data});
    this.setState({startIndexState: data[0], endIndexState: data[1]});
  };
  donePress = () => {
    const {startIndexState, endIndexState} = this.state;
    this.props.timeUpdateDone(startIndexState, endIndexState);
  };
  render() {
    const {startIndexState, endIndexState} = this.state;
    return (
      <StartEndTimeView
        {...this.props}
        timeUpdate={this.timeUpdate}
        startIndexState={startIndexState}
        endIndexState={endIndexState}
        donePress={this.donePress}
      />
    );
  }
}
