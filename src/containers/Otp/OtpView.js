import React from 'react';
import {View, Image as RnImage, TouchableOpacity} from 'react-native';
import {Text, Image, CustomNavbar, CodeInput, Fab} from '../../components';
import styles from './OtpStyles';
import {Fonts, AppStyles, Images, Colors} from '../../theme';
import {resendError} from '../../constants';
export default function OtpView(props) {
  const {autoSubmit} = props;
  var minutes = Math.floor(props.timer / 60);
  var seconds = props.timer - minutes * 60;
  return (
    <View style={styles.container}>
      <CustomNavbar hasBorder={false} />
      <View
        style={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <Text size={Fonts.size.xv}>
          {`Enter the 4-digit code you have received at +44 ${props.num}`}
        </Text>

        <CodeInput codeSubmit={code => props.codeSubmit(code)} />

        <View style={styles.resendParent}>
          <TouchableOpacity
            onPress={() => {
              props.reSendActive ? props.resendPress() : {};
            }}
            activeOpacity={props.reSendActive ? 0 : 9}>
            <Text
              color={
                props.reSendActive ? Colors.accent : Colors.text.secondary
              }>
              Resend Code
            </Text>
          </TouchableOpacity>
          <Text>{`${('0' + minutes).slice(-2)} : ${('0' + seconds).slice(
            -2,
          )}`}</Text>
        </View>
        <View style={[AppStyles.centerInner, {marginTop: 30}]}>
          <Text>{props.code}</Text>
        </View>
        {props.showError && (
          <View style={styles.errorParent}>
            <Text color={'red'}>{resendError}</Text>
          </View>
        )}
      </View>
      <Fab onPress={() => {}} loading={props.loading} disabled />
    </View>
  );
}
