import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import LoginView from './LoginView';
import {Keyboard} from 'react-native';
import util from '../../util';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import {userLoginRequest} from '../../actions/UserActions';

class LoginController extends React.Component {
  constructor() {
    super();
    this.state = {
      number: '923322990445',
      password: 'hassan1219',
      // number: '',
      // password: '',
      // number: '923360219487',
      // password: '123123',
      loading: false,
    };
  }
  static defaultProps = {};

  static propTypes = {};

  email;
  password;

  emailValue = '';
  passwordValue = '';

  onNumberChange = (num, isValid) => {
    console.log({num, isValid});
    if (isValid) {
      this.setState({number: num});
    } else {
      this.setState({number: 'invalid'});
    }
  };
  onPasswordChange = password => {
    this.setState({password});
  };
  onNumberSubmit = () => {
    this.passRef.focus();
  };
  _validateForm(number, password) {
    const errors = {};
    if (_.isEmpty(number)) {
      // Number is required
      util.topAlert('Number is required');
      return false;
    }
    if (number === 'invalid') {
      util.topAlert('Invalid number');
      return false;
    }
    if (_.isEmpty(password)) {
      // password is required

      util.topAlert('Password is required');
      return false;
    }
    if (!util.isPasswordValid(password)) {
      util.topAlert('Invalid password');
      return false;
    }

    return true;
  }

  _onSubmit = () => {
    Keyboard.dismiss();
    let number = '' + this.state.number;
    let password = this.state.password;
    // console.log(number.charAt(0));
    number = number.replace(/ /g, '');
    if (_.isEqual(number.charAt(0), '+')) {
      number = number.substr(1);
    }
    // console.log(number);
    if (this._validateForm(number, password)) {
      const payload = {
        phone: number,
        password: password,
      };
      util.showLoader(this);
      this.props.userLoginRequest(payload, (status, showChangePass, data) => {
        util.hideLoader(this);
        if (status) {
          if (showChangePass) {
            Actions.reset('changePassword', {data: data});
          } else {
            Actions.reset('dashboard');
          }
        }
      });
      // Actions.otp({num: this.state.number});
    }
  };
  render() {
    return (
      <LoginView
        {...this.props}
        passRef={ref => {
          this.passRef = ref;
        }}
        numRef={ref => {
          this.numRef = ref;
        }}
        onNumberSubmit={this.onNumberSubmit}
        keyOpen={this.state.keyOpen}
        onNumberChange={this.onNumberChange}
        onPasswordChange={this.onPasswordChange}
        onSubmit={this._onSubmit}
        loading={this.state.loading}
        number={this.state.number}
        password={this.state.password}
      />
    );
  }
}
const mapStateToProps = ({general}) => ({env: general.env});
const actions = {userLoginRequest};
export default connect(
  mapStateToProps,
  actions,
)(LoginController);
