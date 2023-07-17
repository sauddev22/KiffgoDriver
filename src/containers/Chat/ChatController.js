import React from 'react';
import PropTypes from 'prop-types';
import {setSelectedTab} from '../../actions/GeneralActions';

import ChatView from './ChatView';
import {connect} from 'react-redux';

class ChatController extends React.Component {
  constructor() {
    super();
    this.state = {};
    ChatController.instance = this;
  }
  static onExit() {
    if (ChatController.instance) {
      ChatController.instance._onExit();
    }
  }

  static onEnter() {
    if (ChatController.instance) {
      ChatController.instance._onEnter();
    }
  }
  _onExit() {}

  _onEnter() {
    this.props.setSelectedTab(3);
    // console.log('here in onEnter');
  }
  static propTypes = {};
  static defaultProps = {};
  render() {
    return <ChatView {...this.props} />;
  }
}
const mapStateToProps = ({}) => ({});
const actions = {setSelectedTab};
export default connect(
  mapStateToProps,
  actions,
)(ChatController);
