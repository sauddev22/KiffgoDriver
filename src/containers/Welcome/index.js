// @flow
import _ from 'lodash';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {Text} from '../../components';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import {Images, Colors, AppStyles} from '../../theme';

import styles from './styles';
import {changeBase} from './../../config/WebService';
import {
  setEnv,
  getVehiclesRequest,
  setTaskListFrom,
} from '../../actions/GeneralActions';
import {getUserDataRequest} from '../../actions/UserActions';
import moment from 'moment-timezone';
import {createLogFile, readLogs} from '../../Helper/loggerHelper';

class Welcome extends Component {
  constructor(props) {
    super(props);
    moment.tz.setDefault('GMT+5');
    this.state = {
      loading: true,
      value: true,
    };
  }
  static propTypes = {
    userData: PropTypes.object.isRequired,
  };

  async componentDidMount() {
    this.initialSetup();
    this.getVehicles();
    createLogFile();
    readLogs();
  }
  getVehicles = () => {
    this.props.getVehiclesRequest(() => {
      console.log('getVehicles success');
    });
  };
  initialSetup = () => {
    setTimeout(() => {
      if (_.isNil(this.props.userData.access_token)) {
        // if (this.props.userData.access_token) {
      } else {
        if (_.isNil(this.props.userData.id)) {
          Actions.reset('login');
        } else {
          this.props.getUserDataRequest(() => {
            Actions.reset('dashboard');
          });
        }
      }
    }, 1000);
  };
  handleSwitch() {
    this.setState({value: !this.state.value}, () => {
      changeBase(this.state.value);
      this.props.setEnv(this.state.value ? 'Dev' : 'Staging');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />

        <Image source={Images.newLogo} />
        <ActivityIndicator
          size="large"
          color={Colors.white}
          style={AppStyles.mTop30}
        />
        {false && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
            }}>
            <Switch
              disabled={false}
              trackColor={{
                true: Colors.accent,
                false: '#e5f2ec',
              }}
              thumbColor={Colors.white}
              value={this.state.value}
              onChange={() => {
                this.handleSwitch();
              }}
            />
            <Text color="white">
              Enviroment : {this.state.value ? 'Dev' : 'Staging'}
            </Text>
            <TouchableOpacity onPress={() => this.initialSetup()}>
              <Text color="white">Press to start app</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
import {from} from 'seamless-immutable';
import util from '../../util';

const mapStateToProps = ({user}) => ({
  userData: user.data,
});

const actions = {
  setEnv,
  getVehiclesRequest,
  setTaskListFrom,
  getUserDataRequest,
};

export default connect(
  mapStateToProps,
  actions,
)(Welcome);
