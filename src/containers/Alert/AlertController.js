import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import AlertView from './AlertView';
import {setSelectedTab} from '../../actions/GeneralActions';

const exampleData = [...Array(20)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
    5}, ${132})`,
}));

class AlertController extends React.Component {
  constructor() {
    super();
    this.state = {
      data: exampleData,
    };
    AlertController.instance = this;
  }
  static onExit() {
    if (AlertController.instance) {
      AlertController.instance._onExit();
    }
  }

  static onEnter() {
    if (AlertController.instance) {
      AlertController.instance._onEnter();
    }
  }
  _onExit() {}

  _onEnter() {
    this.props.setSelectedTab(2);
    // console.log('here in onEnter');
  }
  static propTypes = {};
  static defaultProps = {};
  render() {
    return (
      <AlertView
        {...this.props}
        data={this.state.data}
        setData={data => this.setState({data})}
      />
    );
  }
}
const mapStateToProps = ({}) => ({});
const actions = {
  setSelectedTab,
};
export default connect(
  mapStateToProps,
  actions,
)(AlertController);
