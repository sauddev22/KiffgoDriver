import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TabbarView from './TabbarView';
import {setSelectedTab} from '../../actions/GeneralActions';
import {Images} from '../../theme';
import {Actions} from 'react-native-router-flux';
import moment from 'moment-timezone';

const tabsData = [
  {
    name: 'My Tasks',
    image: Images.tab_task,
    selectedImage: Images.tab_task_green,
    onPress: () => Actions.jump('task_tab'),
  },
  {
    name: 'Profile',
    image: Images.tab_profile,
    selectedImage: Images.tab_profile_green,
    onPress: () => Actions.jump('profile_tab'),
  },
  {
    name: 'Alert',
    image: Images.tab_alert,
    selectedImage: Images.tab_alert_green,
    onPress: () => Actions.jump('alert_tab'),
  },
  {
    name: 'Chat',
    image: Images.tab_chat,
    selectedImage: Images.tab_chat_green,
    onPress: () => Actions.jump('chat_tab'),
  },
];
class TabbarController extends React.Component {
  constructor() {
    super();
    this.state = {
      showAvailabilityMark: true,
      showCounter: true,
    };
  }
  static propTypes = {
    selectedTab: PropTypes.number.isRequired,
    setSelectedTab: PropTypes.func.isRequired,
  };
  componentDidMount() {}
  onTabSelect = index => {
    this.props.setSelectedTab(index);
  };
  static defaultProps = {};
  render() {
    const {showAvailabilityMark, showCounter} = this.state;
    return (
      <TabbarView
        {...this.props}
        onTabSelect={this.onTabSelect}
        tabData={tabsData}
        showAvailabilityMark={showAvailabilityMark}
        showCounter={showCounter}
      />
    );
  }
}
const mapStateToProps = ({general, jobs}) => ({
  selectedTab: general.selectedTab,
  lastAvailabilityVisit: general.lastAvailabilityVisit,
});
const actions = {setSelectedTab};
export default connect(
  mapStateToProps,
  actions,
)(TabbarController);
