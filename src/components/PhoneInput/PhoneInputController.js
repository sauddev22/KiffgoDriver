import React from 'react';
import PropTypes from 'prop-types';
import PhoneInputView from './PhoneInputView';
import {ViewPropTypes} from 'react-native';

export default class PhoneInputController extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    value: PropTypes.string || PropTypes.number,
    verified: PropTypes.bool,
    containerStyles: ViewPropTypes.style,
    active: PropTypes.bool,
  };
  static defaultProps = {
    value: '',
    verified: false,
    containerStyles: {},
    active: true,
  };
  render() {
    return <PhoneInputView {...this.props} />;
  }
}
