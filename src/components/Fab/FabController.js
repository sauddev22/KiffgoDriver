import React from 'react';
import PropTypes from 'prop-types';
import FabView from './FabView';
import {Colors, Images} from '../../theme';

export default class FabController extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    icon: PropTypes.number,
    loading: PropTypes.bool,
    indicatorColor: PropTypes.string,
    onPress: PropTypes.func.isRequired,
  };
  static defaultProps = {
    color: Colors.accent,
    icon: Images.forward,
    loading: false,
    indicatorColor: Colors.white,
  };
  render() {
    return <FabView {...this.props} />;
  }
}
