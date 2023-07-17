import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ChangePasswordView from './ChangePasswordView';
import {USER_FIELDS_NAME} from '../../constants';
import {
  userLogoutRequest,
  userChangePasswordRequest,
} from '../../actions/UserActions';
import {Actions} from 'react-native-router-flux';
import util from '../../util';
import _ from 'lodash';

class ChangePasswordController extends React.Component {
  constructor() {
    super();
    this.state = {password: '', loading: false};
  }
  static propTypes = {
    phone: PropTypes.string.isRequired,
    userLogoutRequest: PropTypes.func.isRequired,
  };
  static defaultProps = {};
  onPasswordChange = password => {
    this.setState({password});
  };
  onCancelPress = () => {
    this.props.userLogoutRequest(status => {
      if (status) {
        Actions.reset('login');
      }
    });
  };
  _validateForm() {
    const {password} = this.state;
    const errors = {};
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
  onSavePress = () => {
    if (this._validateForm()) {
      this.setState({loading: true});
      const payload = {};
      payload.phone = this.props.phone;
      payload.password = this.state.password;
      this.props.userChangePasswordRequest(payload, status => {
        this.setState({loading: false});
        if (status) {
          util.topAlert('Password updated');
          Actions.reset('dashboard');
        }
      });
    }
  };
  render() {
    return (
      <ChangePasswordView
        {...this.props}
        password={this.state.password}
        passRef={ref => {
          this.passRef = ref;
        }}
        onPasswordChange={this.onPasswordChange}
        onCancelPress={this.onCancelPress}
        onSavePress={this.onSavePress}
        loading={this.state.loading}
      />
    );
  }
}
const mapStateToProps = ({user}) => ({
  phone: user.data[USER_FIELDS_NAME.PHONE],
});
const actions = {userLogoutRequest, userChangePasswordRequest};
export default connect(
  mapStateToProps,
  actions,
)(ChangePasswordController);
