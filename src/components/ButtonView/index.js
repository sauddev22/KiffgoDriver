import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';

import Util from '../../util';

let disableOnPress = false;

const debounceTime = Platform.select({
  ios: 200,
  android: 700,
});

export default class ButtonView extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    style: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.number,
    ]),
    borderless: PropTypes.bool,
    children: PropTypes.node.isRequired,
    debounce: PropTypes.bool,
    withoutFeedback: PropTypes.bool,
    touchableOpacityView: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
    onPress: () => {},
    borderless: false,
    debounce: true,
    withoutFeedback: false,
    touchableOpacityView: false,
  };

  _onPress = () => {
    if (!disableOnPress) {
      disableOnPress = true;
      if (this.props.onPress) {
        this.props.onPress();
      }

      setTimeout(
        () => {
          disableOnPress = false;
        },
        this.props.debounce ? debounceTime : 0,
      );
    }
  };

  render() {
    const {
      style,
      children,
      borderless,
      withoutFeedback,
      touchableOpacityView,
      ...rest
    } = this.props;

    if (withoutFeedback) {
      return (
        <TouchableWithoutFeedback
          {...rest}
          borderless={borderless}
          onPress={this._onPress}>
          <View style={style}>{this.props.children}</View>
        </TouchableWithoutFeedback>
      );
    }

    if (Util.isPlatformAndroid() && !touchableOpacityView) {
      return (
        <TouchableNativeFeedback
          {...rest}
          borderless={borderless}
          onPress={this._onPress}>
          <View style={style}>{this.props.children}</View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        style={style}
        {...rest}
        onPress={this._onPress}
        activeOpacity={0.7}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
