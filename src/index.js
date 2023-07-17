// @flow
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppRegistry, View, NativeModules, StatusBar} from 'react-native';
import {MessageBar, Text} from './components';
import configureStore from './store';
import AppNavigator from './navigator';
import applyConfigSettings from './config';
import AppStyles from './theme/AppStyles';
import Util from './util';
import DataHandler from './services/DataHandler';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {Colors} from './theme';
import {updateToken} from './Helper/trackingHelper';

const reducers = require('./reducers').default;

applyConfigSettings();

export default class App extends Component {
  state = {
    isLoading: true,
    store: configureStore(reducers, () => {
      this._loadingCompleted();
      this.setState({isLoading: false});
    }),
  };

  _loadingCompleted() {
    DataHandler.setStore(this.state.store);
  }

  componentDidMount() {
    if (Util.isPlatformAndroid()) {
      setTimeout(() => {
        NativeModules.SplashScreen.hide();
      }, 2000);
    }
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <View style={AppStyles.flex}>
        <StatusBar
          backgroundColor={Colors.background.primary}
          barStyle="light-content"
          translucent={true}
        />
        <Provider store={this.state.store}>
          <AppNavigator />
        </Provider>
        <MessageBar />
      </View>
    );
  }
}

AppRegistry.registerComponent('AutoConnect', () => App);
////
// Define your Headless task -- simply a javascript async function to receive
// events from BackgroundGeolocation:
//
let HeadlessTask = async event => {
  let params = event.params;
  console.log('[BackgroundGeolocation HeadlessTask] -', event.name, params);

  switch (event.name) {
    case 'heartbeat':
      // Use await for async tasks
      let location = await getCurrentPosition();
      console.log(
        '[BackgroundGeolocation HeadlessTask] - getCurrentPosition:',
        location,
      );
      break;
    case 'http':
      // Use await for async tasks
      console.log('calling http');
      if (!event.params.success) {
        const token = await Util.refreshAccessToken();
        updateToken(token);
      }
      break;
  }
};
let getCurrentPosition = () => {
  return new Promise(resolve => {
    BackgroundGeolocation.getCurrentPosition(
      {
        samples: 1,
        persist: false,
      },
      location => {
        resolve(location);
      },
      error => {
        resolve(error);
      },
    );
  });
};

////
// Register your HeadlessTask with BackgroundGeolocation plugin.
//
BackgroundGeolocation.registerHeadlessTask(HeadlessTask);
