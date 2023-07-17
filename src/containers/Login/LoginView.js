import React from 'react';
import {
  View,
  Image as RnImage,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Text, Fab, TextInput, ContactInput} from '../../components';
import styles from './LoginStyles';
import {Fonts, AppStyles, Images, Colors} from '../../theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {activeOpacity} from '../../constants';
import {Actions} from 'react-native-router-flux';
import {Linking} from 'react-native';
export default function LoginView(props) {
  return (
    <View style={AppStyles.flex}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.background.primary}
      />
      <KeyboardAwareScrollView
        style={[AppStyles.primaryBackground]}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}>
        <View
          style={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <RnImage
            source={Images.newLogo}
            resizeMode="contain"
            style={styles.headerImage}
          />
          {/* <Text style={{alignSelf: 'center'}}>{`Env : ${props.env}`}</Text> */}

          <ContactInput
            returnKeyType="done"
            keyboardType="phone-pad"
            value={props.number !== 'invalid' ? props.number : ''}
            onNumberChange={(num, ref) => {
              props.onNumberChange(num, ref.isValidNumber());
            }}
            ref={ref => {
              props.numRef(ref);
            }}
            error={props.contactError}
            onSubmitEditing={() => props.onNumberSubmit()}
            onClickFlag={true}
          />
          <TextInput
            ref={ref => {
              props.passRef(ref);
            }}
            placeholder="Password"
            type="password"
            value={props.password}
            onChangeText={pass => props.onPasswordChange(pass)}
            onSubmitEditing={() => props.onSubmit()}
          />
          <TouchableOpacity
            activeOpacity={activeOpacity.medium}
            style={styles.buttonParent}
            onPress={() => props.onSubmit()}>
            <LinearGradient style={styles.button} colors={Colors.greenGradient}>
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
          <Text
            onPress={() => Actions.ForgotPassword()}
            style={styles.forgotText}
            color={Colors.accent}
            type="bold"
            size={Fonts.size.xvii}>
            Forgot password
          </Text>
          <Text
            style={styles.termServiceText}
            color={Colors.white}
            size={Fonts.size.xv}>
            By logging in you agree to our{' '}
            <Text
              onPress={() => Linking.openURL('https://kiffgo.com/terms-of-use')}
              style={AppStyles.textUnderline}
              color={Colors.white}
              size={Fonts.size.xv}>
              Terms of Use.
            </Text>
            {' & '}
            <Text
              onPress={() =>
                Linking.openURL('https://kiffgo.com/privacy-policy')
              }
              style={AppStyles.textUnderline}
              color={Colors.white}
              size={Fonts.size.xv}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
