import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {View} from 'react-native';
import styles from './BottomSheetAlertStyles';
import {AppStyles, Fonts} from '../../theme';
import {Text, Button} from '../';

export default function BottomSheetAlertView(props) {
  return (
    <>
      <RBSheet
        animationType="fade"
        ref={ref => {
          props.bottomSheetRef(ref);
        }}
        height={284}
        duration={250}
        customStyles={{
          container: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 40,
            paddingRight: 40,
            borderRadius: 7,
          },
        }}>
        <View
          style={[
            AppStyles.alignItemsCenter,
            AppStyles.spaceBetween,
            AppStyles.flex,
            styles.bottomSheetContainer,
          ]}>
          <View>
            <Text
              style={AppStyles.textAlignCenter}
              type="bold"
              size={Fonts.size.xxvi}>
              {props.title}
            </Text>
            {props.subTitle !== '' && (
              <Text
                size={Fonts.size.xvi}
                style={[AppStyles.textAlignCenter, AppStyles.mTop10]}>
                {props.subTitle}
              </Text>
            )}
          </View>

          <View style={AppStyles.flexRow}>
            {props.negativeButtonText !== '' && (
              <View style={[AppStyles.flex, AppStyles.mRight15]}>
                <Button
                  size={Fonts.size.xvi}
                  type="bold"
                  color={props.negativeButtonTextColor}
                  style={AppStyles.btnStyle2}
                  onPress={props.negativeButtonEvent}
                  background={props.negativeButtonBgColor}>
                  {props.negativeButtonText}
                </Button>
              </View>
            )}
            {props.positiveButtonText !== '' && (
              <View style={AppStyles.flex}>
                <Button
                  size={Fonts.size.xvi}
                  type="bold"
                  color={props.positiveButtonTextColor}
                  style={AppStyles.btnStyle1}
                  isLoading={props.positiveButtonLoading}
                  onPress={props.positiveButtonEvent}
                  background={props.positiveButtonBgColor}>
                  {props.positiveButtonText}
                </Button>
              </View>
            )}
          </View>
        </View>
      </RBSheet>
    </>
  );
}

// <BottomSheetAlert
// title="Are you sure?"
// subTitle="  You will get a penalty of £250 charged to your account."
// positiveButtonText="Sure"
// positiveButtonBgColor={Colors.bitterSweet}
// positiveButtonTextColor={Colors.white}
// positiveButtonEvent={() => {
//   alert('test');
// }}
// negativeButtonText="Cencel"
// negativeButtonBgColor={Colors.gallery}
// negativeButtonTextColor={Colors.black}
// negativeButtonEvent={() => {
//   alert('test');
// }}
// />
