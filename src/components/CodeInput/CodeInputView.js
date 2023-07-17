import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './CodeInputStyles';
import {Text, Button} from '../index';
import CodeInput from 'react-native-confirmation-code-input';
import {Colors, AppStyles, Fonts} from '../../theme';
export default function CodeInputView(props) {
  return (
    <View style={[AppStyles.centerInner]}>
      <View
        style={{
          paddingStart: 12,
          height: 80,
          alignItems: 'center',
        }}>
        <CodeInput
          space={12}
          codeInputStyle={styles.codeInput}
          codeLength={4}
          inputPosition="left"
          activeColor={Colors.text.primary}
          inactiveColor={Colors.text.secondary}
          onFulfill={code => props.codeSubmit(code)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
