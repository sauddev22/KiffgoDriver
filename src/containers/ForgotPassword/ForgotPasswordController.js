import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Keyboard} from 'react-native';
import ForgotPasswordView from './ForgotPasswordView';
import {userForgotPasswordRequest} from '../../actions/UserActions';
import util from '../../util';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';

class ForgotPasswordController extends React.Component {
  constructor() {
    super();
    this.state = {
      number: '',
      loading: false,
    };
  }
  static propTypes = {};
  static defaultProps = {};
  _validateForm() {
    const {number} = this.state;
    const errors = {};
    if (_.isEmpty(number)) {
      util.topAlert('Number is required');
      return false;
    }
    if (number === 'invalid') {
      util.topAlert('Invalid number');
      return false;
    }

    return true;
  }

  submitPress = () => {
    Keyboard.dismiss();
    if (this._validateForm()) {
      const payload = {};
      Keyboard.dismiss();
      let number = '' + this.state.number;
      number = number.replace(/ /g, '');
      if (_.isEqual(number.charAt(0), '+')) {
        number = number.substr(1);
      }
      payload.phone = number;
      this.setState({loading: true});
      this.props.userForgotPasswordRequest(payload, status => {
        this.setState({loading: false});
        if (status) {
          util.topAlert('Reset code sent successfully');
          Actions.pop();
        }
      });
    }
  };
  onNumberChange = (num, isValid) => {
    console.log({num, isValid});
    if (isValid) {
      this.setState({number: num});
    } else {
      this.setState({number: 'invalid'});
    }
  };
  render() {
    return (
      <ForgotPasswordView
        {...this.props}
        number={this.state.number}
        onNumberChange={this.onNumberChange}
        submitPress={this.submitPress}
        loading={this.state.loading}
      />
    );
  }
}
const mapStatToProps = ({}) => ({});
const actions = {userForgotPasswordRequest};
export default connect(
  mapStatToProps,
  actions,
)(ForgotPasswordController);
