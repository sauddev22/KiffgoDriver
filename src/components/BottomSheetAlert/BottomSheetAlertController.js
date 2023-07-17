import React from 'react';
import PropTypes from 'prop-types';
import {Colors} from '../../theme';
import BottomSheetAlertView from './BottomSheetAlertView';

export default class BottomSheetAlertController extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    positiveButtonText: PropTypes.string,
    positiveButtonEvent: PropTypes.func,
    positiveButtonBgColor: PropTypes.string,
    positiveButtonTextColor: PropTypes.string,
    negativeButtonText: PropTypes.string,
    negativeButtonEvent: PropTypes.func,
    negativeButtonBgColor: PropTypes.string,
    negativeButtonTextColor: PropTypes.string,
    getRef: PropTypes.func.isRequired,
    positiveButtonLoading: PropTypes.bool,
  };

  static defaultProps = {
    subTitle: '',
    positiveButtonText: '',
    positiveButtonEvent: () => {},
    positiveButtonBgColor: Colors.bitterSweet,
    positiveButtonTextColor: Colors.white,
    negativeButtonText: '',
    negativeButtonEvent: () => {},
    negativeButtonBgColor: Colors.gallery,
    negativeButtonTextColor: Colors.black,
    positiveButtonLoading: false,
  };

  render() {
    return (
      <BottomSheetAlertView
        {...this.props}
        bottomSheetRef={ref => {
          this.props.getRef(ref);
        }}
        showBottomSheet={this.showBottomSheet}
      />
    );
  }
}
