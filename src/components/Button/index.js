// @flow
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Platform,
  StyleSheet,
  ViewPropTypes,
  Text as TextRN,
  TouchableOpacity,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import {Text} from '../';
import styles from './styles';
import {Metrics, Images, Fonts, Colors} from '../../theme';

function renderInnerText(
  title,
  color,
  size,
  type,
  textStyle,
  isLoading,
  indicatorColor,
  textAlign,
) {
  if (isLoading) {
    return (
      <ActivityIndicator
        animating
        size="small"
        style={styles.spinner}
        color={indicatorColor}
      />
    );
  }

  return (
    <Text
      color={color}
      size={size}
      type={type}
      textAlign={textAlign}
      style={textStyle}>
      {title}
    </Text>
  );
}

function renderIcon(icon, iconRight, iconStyles) {
  if (!icon) {
    return null;
  }

  return (
    <Image
      resizeMode="contain"
      source={icon}
      style={[styles.icon, iconStyles]}
    />
  );
}

const Button = (props: Object) => {
  const {
    style,
    color,
    size,
    type,
    icon,
    raised,
    iconRight,
    children,
    disabled,
    textAlign,
    isLoading,
    textStyle,
    background,
    indicatorColor,
    iconStyles,
    ...rest
  } = props;

  const buttonStyle = StyleSheet.flatten([
    styles.button,
    raised && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,

      elevation: 1,
    },
    {
      backgroundColor: Colors.background[background] || background,
    },
    style,
    disabled && styles.opacity,
  ]);

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback disabled={disabled} {...rest}>
        <View style={buttonStyle}>
          {renderIcon(icon, iconRight, iconStyles)}
          {renderInnerText(
            children,
            color,
            size,
            type,
            textStyle,
            isLoading,
            indicatorColor,
            textAlign,
          )}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity disabled={disabled} style={buttonStyle} {...rest}>
      {renderIcon(icon, iconRight, iconStyles)}
      {renderInnerText(
        children,
        color,
        size,
        type,
        textStyle,
        isLoading,
        indicatorColor,
        textAlign,
      )}
    </TouchableOpacity>
  );
};

Button.propTypes = {
  icon: PropTypes.number,
  raised: PropTypes.bool,
  iconRight: PropTypes.bool,
  style: ViewPropTypes.style,
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(_.keys(Fonts.size)),
    PropTypes.number,
  ]),
  background: PropTypes.string,
  children: PropTypes.string.isRequired,
  type: PropTypes.oneOf(_.keys(Fonts.type)),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  textStyle: TextRN.propTypes.style,
  indicatorColor: PropTypes.string,
  textAlign: PropTypes.oneOf(['auto', 'left', 'right', 'center', 'justify']),
  iconStyles: ViewPropTypes.style,
};

Button.defaultProps = {
  style: {},
  Size: 'normal',
  type: 'base',
  icon: undefined,
  color: 'primary',
  raised: false,
  iconRight: false,
  disabled: false,
  isLoading: false,
  indicatorColor: 'black',
  textAlign: 'center',
  background: 'secondary',
  textStyle: {flex: 1},
  iconStyles: {},
};

export default Button;
