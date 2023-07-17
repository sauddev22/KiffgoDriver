import React from 'react';
import PropTypes from 'prop-types';
import AnimatedButtonView from './AnimatedButtonView';
import {Animated} from 'react-native';
import {Colors} from '../../theme';
let ACTION_TIMER = 3000;
export default class AnimatedButtonController extends React.Component {
  constructor() {
    super();
    this.state = {
      pressAction: new Animated.Value(0),
      buttonWidth: 0,
      buttonHeight: 0,
      done: false,
    };
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    buttonColors: PropTypes.array,
  };
  static defaultProps = {
    text: 'press me',
    loading: false,
    buttonColors: [Colors.blueGradient, Colors.greenGradient],
  };
  componentDidMount() {
    this._value = 0;
    this.state.pressAction.addListener(v => (this._value = v.value));
  }
  getButtonWidthLayout = e => {
    this.setState({
      buttonWidth: e.nativeEvent.layout.width,
      buttonHeight: e.nativeEvent.layout.height,
    });
  };
  handlePressIn = () => {
    Animated.timing(this.state.pressAction, {
      duration: ACTION_TIMER,
      toValue: 1,
    }).start(this.animationActionComplete);
  };
  handlePressOut = () => {
    if (!this.state.done) {
      Animated.timing(this.state.pressAction, {
        duration: this._value * 900,
        toValue: 0,
      }).start();
    }
  };
  animationActionComplete = () => {
    if (this._value === 1) {
      this.setState({done: true});
      this.props.onPress();
    }
  };

  getProgressStyles = () => {
    var width = this.state.pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.buttonWidth],
    });

    return {
      width: width,
      height: this.state.buttonHeight,
    };
  };
  render() {
    return (
      <AnimatedButtonView
        {...this.props}
        getButtonWidthLayout={this.getButtonWidthLayout}
        handlePressIn={this.handlePressIn}
        handlePressOut={this.handlePressOut}
        getProgressStyles={this.getProgressStyles}
      />
    );
  }
}
