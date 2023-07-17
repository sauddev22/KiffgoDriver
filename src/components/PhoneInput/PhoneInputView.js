import React from 'react';
import {View, Image as RnImage, TextInput} from 'react-native';
import {Text, Image} from '../';
import styles from './PhoneInputStyles';
import {Fonts, Colors, Images} from '../../theme';
export default function PhoneInputView(props) {
  return (
    <View style={[styles.container, props.containerStyles]}>
      <View style={styles.code}>
        <Text size={Fonts.size.xix}>+44</Text>
      </View>
      <View style={styles.line} />
      <TextInput
        editable={props.active}
        value={props.value}
        autoCorrect={false}
        autoFocus={true}
        keyboardType="phone-pad"
        placeholder="0000000000"
        style={styles.textInput}
        onChangeText={text => {
          props.onChangeText(text);
        }}
        onSubmitEditing={() => {
          props.onSubmit();
        }}
      />
      {props.verified && (
        <View style={styles.tickParent}>
          <RnImage source={Images.tick} style={styles.tickIcon} />
        </View>
      )}
    </View>
  );
}
