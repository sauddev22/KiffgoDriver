// @flow
import React from 'react';
import {connect} from 'react-redux';
import {
  Stack,
  Scene,
  Router,
  Actions,
  Tabs,
  Drawer,
} from 'react-native-router-flux';
import {View} from 'react-native';
import styles from './styles';
import {Colors, AppStyles} from '../theme';

import {
  Login,
  Welcome,
  Tour,
  Otp,
  TaskList,
  TaskDetails,
  ChangePassword,
  ForgotPassword,
  Profile,
  Alert,
  Chat,
  PerformTask,
  FailureReason,
  Signature,
  TaskHistory,
  BarcodeScanner,
} from '../containers';
import {Tabbar} from '../components';
import {from} from 'seamless-immutable';

function onBackPress() {
  if (Actions.state.index === 0) {
    return false;
  }
  Actions.pop();
  return true;
}

const navigator = Actions.create(
  <Stack
    key="root"
    titleStyle={styles.title}
    headerStyle={styles.header}
    headerTintColor={Colors.navbar.text}>
    <Tabs
      key="dashboard"
      swipeEnabled={false}
      tabBarComponent={() => <Tabbar />}
      hideNavBar>
      <Stack key="task_tab" title="Task tab" initial>
        <Scene key="taskLists" component={TaskList} hideNavBar />
        <Scene key="taskDetails" component={TaskDetails} hideNavBar />
        <Scene key="performTask" component={PerformTask} hideNavBar />
        <Scene key="failureReason" component={FailureReason} hideNavBar />
      </Stack>
      <Stack key="profile_tab" title="Profile tab">
        <Scene key="profile" component={Profile} hideNavBar />
      </Stack>
      <Stack key="alert_tab" title="Alert tab">
        <Scene key="alert" component={Alert} hideNavBar />
      </Stack>
      <Stack key="chat_tab" title="Chat tab">
        <Scene key="chat" component={Chat} hideNavBar />
      </Stack>
    </Tabs>
    <Scene key="signature" component={Signature} hideNavBar />
    <Scene key="login" component={Login} hideNavBar />
    <Scene key="changePassword" component={ChangePassword} hideNavBar />
    <Scene key="ForgotPassword" component={ForgotPassword} hideNavBar />
    <Scene key="welcome" component={Welcome} hideNavBar initial />
    <Scene key="login" component={Login} hideNavBar />
    <Scene key="tour" component={Tour} hideNavBar />
    <Scene key="otp" component={Otp} hideNavBar />
    <Scene key="taskHistory" component={TaskHistory} hideNavBar />
    <Scene key="taskDetailsCompleted" component={TaskDetails} hideNavBar />
    <Scene key="barcodeScanner" component={BarcodeScanner} hideNavBar />
  </Stack>,
);

export default () => (
  <AppNavigator navigator={navigator} backAndroidHandler={onBackPress} />
);

const AppNavigator = connect()(Router);
