import React from 'react';
import {
  View,
  Image as RnImage,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styles from './FabStyles';
import {Images} from '../../theme';
import Util from '../../util';
export default function FabView(props) {
  const {indicatorColor, loading, onPress, disabled} = props;
  return (
    <View style={{position: 'absolute', bottom: 30, right: 30}}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[styles.container]}
        disabled={disabled}>
        {!loading && <RnImage source={Images.forward} />}
        {loading && <ActivityIndicator color={indicatorColor} />}
      </TouchableOpacity>
      {!Util.isPlatformAndroid() && <KeyboardSpacer />}
    </View>
  );
}
