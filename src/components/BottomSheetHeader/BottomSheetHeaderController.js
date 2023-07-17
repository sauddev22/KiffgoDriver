import React from 'react';
import PropTypes from 'prop-types';
import BottomSheetHeaderView from './BottomSheetHeaderView';

export default class BottomSheetHeaderController extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  render() {
    return <BottomSheetHeaderView {...this.props} />;
  }
}
