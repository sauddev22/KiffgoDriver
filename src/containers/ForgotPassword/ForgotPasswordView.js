import React from 'react';
import {
  View,
  Image as RnImage,
  SafeAreaView,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {Text, Image, ContactInput} from '../../components';
import styles from './ForgotPasswordStyles';
import {Images, AppStyles, Fonts, Colors} from '../../theme';
import {TouchableOpacity} from 'react-native';
import {activeOpacity} from '../../constants';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

export default function ForgotPasswordView(props) {
  return (
    <View style={AppStyles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => Actions.pop()}
          activeOpacity={activeOpacity.medium}>
          <RnImage source={Images.back_white} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text size={Fonts.size.xx} style={styles.headingText}>
            Reset password
          </Text>
          <View style={[AppStyles.flex, AppStyles.mTop50]}>
            <ContactInput
              returnKeyType="done"
              keyboardType="phone-pad"
              value={props.number !== 'invalid' ? props.number : ''}
              onNumberChange={(num, ref) => {
                props.onNumberChange(num, ref.isValidNumber());
              }}
              onClickFlag={true}
              onSubmitEditing={props.submitPress}
            />
            <TouchableOpacity
              activeOpacity={activeOpacity.medium}
              style={styles.buttonParent}
              onPress={() => props.submitPress()}>
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
        </View>
      </View>
    </View>
  );
}
