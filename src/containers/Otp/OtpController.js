import React from 'react';
import PropTypes from 'prop-types';
import OtpView from './OtpView';
import {Keyboard, Platform} from 'react-native';
import util from '../../util';
import {
  requestCode,
  verifyCodeRequest,
  userLoginSuccess,
} from '../../actions/UserActions';
import {connect} from 'react-redux';
import {SOMETHING_WRONG} from '../../constants';
import {Actions} from 'react-native-router-flux';
import {make_user_data} from '../../Helper';

class OtpController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      attempt: 0,
      initial: 60,
      increment: 30,
      reSendActive: false,
      timer: 60,
      showError: false,
      code: props.code,
      pass: '',
    };
  }
  componentDidMount() {
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.clockCall);
  }
  decrementClock = () => {
    this.setState(prevstate =>
      prevstate.timer === 0
        ? prevstate.showError
          ? {reSendActive: false}
          : {reSendActive: true}
        : {timer: prevstate.timer - 1},
    ),
      () => {
        if (prevstate.timer === 0) {
          clearInterval(this.clockCall);
        }
      };
  };
  activeResend = () => {};
  static propTypes = {num: PropTypes.number.isRequired};
  static defaultProps = {
    num: '7941941941',
    code: '2323',
  };
  resendPress = () => {
    const payload = {
      phone: '44' + this.props.num,
    };
    this.state.attempt < 3
      ? this.props.requestCode(payload, (status, code) => {
          if (status) {
            this.setState(prevstate => ({
              attempt: prevstate.attempt + 1,
              timer:
                prevstate.initial +
                prevstate.increment * (prevstate.attempt + 1),
              reSendActive: false,
              code,
            }));
          }
        })
      : this.setState({showError: true, reSendActive: false});
  };
  codeSubmit = newCode => {
    Keyboard.dismiss();
    const {num} = this.props;
    const newPass = util.generateGuid();
    const payload = {
      devicePlatform: Platform.OS,
      phone: '44' + num,
      code: newCode,
      password: newPass,
    };

    //check if user enter 4 digit then loading start
    if (newCode.toString().length == 4) {
      this.setState({
        loading: true,
      });
    }

    this.props.verifyCodeRequest(payload, (status, data) => {
      //loading state false
      this.setState({
        loading: false,
      });
      if (status) {
        this.setState({pass: newPass});
        if (data) {
          if (data.driver_profile.length < 1 || data.show_onboarding) {
            Actions.reset('onBoarding', {num: num});
          } else {
            if (data.is_verified) {
              // added true due to missing key from server
              console.log(data);
              this.props.userLoginSuccess(make_user_data([data]));
              util.setGenericPassword('44' + num, newPass);
              Actions.reset('dashboard');
            } else {
              Actions.reset('approval');
            }
          }
        } else {
          util.topAlert(SOMETHING_WRONG);
        }
      }
    });
  };
  onSubmit = () => {
    Keyboard.dismiss();

    if (this.state.code.length < 4) {
      util.topAlert('Invalid code');
    }
  };
  render() {
    const {showError, keyOpen, reSendActive, timer, loading} = this.state;
    return (
      <OtpView
        {...this.props}
        reSendActive={reSendActive}
        timer={timer}
        resendPress={this.resendPress}
        showError={showError}
        codeSubmit={this.codeSubmit}
        onSubmit={this.onSubmit}
        code={this.state.code}
        loading={loading}
      />
    );
  }
}
const mapStateToProps = ({user}) => ({passData: user.passData});
const actions = {requestCode, verifyCodeRequest, userLoginSuccess};
export default connect(
  mapStateToProps,
  actions,
)(OtpController);
