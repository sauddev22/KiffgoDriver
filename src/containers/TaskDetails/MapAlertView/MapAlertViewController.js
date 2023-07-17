import React from 'react';
import PropTypes from 'prop-types';
import MapAlertViewView from './MapAlertViewView';
import {createOpenLink} from 'react-native-open-maps';
import {connect} from 'react-redux';
import {MAP_TYPES, TASK_FIELDS_NAME} from '../../../constants';
import util from '../../../util';
import {WAZE_BASE_URL} from '../../../config/WebService';
import {Clipboard} from 'react-native';
import _ from 'lodash';

class MapAlertViewController extends React.Component {
  constructor() {
    super();
    this.state = {
      currentLocation: {},
      clipboardContent: null,
    };
  }
  static propTypes = {
    task: PropTypes.object.isRequired,
    mapOnClick: PropTypes.func.isRequired,
  };
  static defaultProps = {};
  async componentDidMount() {
    if (_.isEmpty(this.state.currentLocation)) {
      const location = await util.findCoordinates();

      this.setState({
        currentLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    }
  }
  writeToClipboard = async () => {
    //To copy the text to clipboard
    await Clipboard.setString(
      this.props.task[TASK_FIELDS_NAME.LOCATION_BUSINESS_NAME] +
        ' , ' +
        this.props.task[TASK_FIELDS_NAME.STREET_NUMBER] +
        ' , ' +
        this.props.task[TASK_FIELDS_NAME.STREET_NAME] +
        ' , ' +
        this.props.task[TASK_FIELDS_NAME.LOCATION_CITY] +
        ' , ' +
        this.props.task[TASK_FIELDS_NAME.LOCATION_POSTCODE] +
        ' , ' +
        this.props.task[TASK_FIELDS_NAME.COUNTRY_NAME],
    );
    alert('Copied to Clipboard!');
  };
  _onNavBtnPress = (provider, startAddress, endAddress) => {
    if (provider === MAP_TYPES.WAZE) {
      // Util.openLinkInBrowser(`${WAZE_BASE_URL}q=${endAddress}`);
      this.props.mapOnClick();

      util.openLinkInBrowser(
        `${WAZE_BASE_URL}ll=${endAddress.latitude},${
          endAddress.longitude
        }&navigate=yes`,
      );
    } else {
      const payload = {
        end: `${endAddress.latitude},${endAddress.longitude}`,
        provider,
        ...(startAddress && {
          start: `${startAddress.latitude},${startAddress.longitude}`,
        }),
      };

      const openYosemite = createOpenLink(payload);
      this.props.mapOnClick();
      openYosemite();
    }
  };
  render() {
    console.log({checkThis: this.props.currentLocation});
    return (
      <MapAlertViewView
        {...this.props}
        onNavBtnPress={this._onNavBtnPress}
        currentLocation={this.state.currentLocation}
        writeToClipboard={this.writeToClipboard}
      />
    );
  }
}
const mapStateToProps = ({}) => ({});
const actions = {};
export default connect(
  mapStateToProps,
  actions,
)(MapAlertViewController);
