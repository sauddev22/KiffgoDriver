import React from 'react';
import PropTypes from 'prop-types';
import CircularImageView from './CircularImageView';
import {Images} from '../../theme';

export default class CircularImageController extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    containerStyles: PropTypes.object,
    noShadow: PropTypes.bool,
  };
  static defaultProps = {
    size: 40,
    image: Images.placeHolder,
    containerStyles: {},
    noShadow: false,
  };
  render() {
    return <CircularImageView {...this.props} />;
  }
}
