import React from 'react';
import {
  View,
  Image as RnImage,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Text, Image} from '../../components';
import styles from './AnimatedButtonStyles';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, AppStyles, Fonts} from '../../theme';

export default function AnimatedButtonView(props) {
  const {
    text,
    handlePressOut,
    handlePressIn,
    getButtonWidthLayout,
    getProgressStyles,
    loading,
    buttonColors,
  } = props;
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <LinearGradient
          colors={buttonColors[0]}
          style={styles.button}
          onLayout={getButtonWidthLayout}>
          <Animated.View style={[styles.bgFill, getProgressStyles()]}>
            <LinearGradient colors={buttonColors[1]} style={AppStyles.flex} />
          </Animated.View>
          {!loading && (
            <Text type="bold" size={Fonts.size.xviii} style={styles.text}>
              {text}
            </Text>
          )}
          {loading && <ActivityIndicator color={Colors.white} />}
        </LinearGradient>
      </TouchableWithoutFeedback>
    </View>
  );
}
