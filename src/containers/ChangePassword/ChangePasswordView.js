import React from 'react';
import {
  View,
  Image as RnImage,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Text, Fab, TextInput, ContactInput} from '../../components';
import styles from './ChangePasswordStyles';
import {Fonts, AppStyles, Images, Colors} from '../../theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DotIndicator} from 'react-native-indicators';
import {activeOpacity} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
export default function ChangePasswordView(props) {
  return (
    <KeyboardAwareScrollView
      style={AppStyles.primaryBackground}
      alwaysBounceVertical={false}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.background.primary}
      />
      <View
        style={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        {/* <Text style={{alignSelf: 'center'}}>{`Env : ${props.env}`}</Text> */}
        <View style={[AppStyles.mBottom30, {flexDirection: 'row'}]}>
          <Text size={Fonts.size.xLarge}>+{props.phone.substring(0, 2)} </Text>
          <Text size={Fonts.size.xLarge} type="bold">
            {props.phone.substring(2)}
          </Text>
        </View>
        <View style={[AppStyles.mTop10, {width: '100%'}]}>
          <Text type="bold">Choose a new password</Text>
          <TextInput
            ref={ref => {
              props.passRef(ref);
            }}
            placeholder="New Password"
            type="password"
            value={props.password}
            onChangeText={pass => props.onPasswordChange(pass)}
            onSubmitEditing={() => props.onSubmit()}
          />
          <Text style={{alignSelf: 'flex-end'}} color={'#ffb484'}>
            Should be at least 5 characters
          </Text>
          {!props.loading && (
            <View style={styles.buttonParent}>
              <Text onPress={() => props.onCancelPress()} type="bold">
                Cancel
              </Text>

              <TouchableOpacity
                activeOpacity={activeOpacity.medium}
                style={styles.circleButtonParent}
                onPress={() => props.onSavePress()}>
                <LinearGradient
                  style={styles.button}
                  colors={Colors.greenGradient}>
                  {!props.loading && (
                    <RnImage
                      resizeMode="contain"
                      style={styles.arrowIcon}
                      source={Images.forward}
                    />
                  )}
                  {props.loading && <ActivityIndicator color={Colors.white} />}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          {props.loading && (
            <View style={AppStyles.mTop20}>
              <DotIndicator
                animationDuration={1000}
                color={Colors.accent}
                size={8}
                count={3}
              />
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
