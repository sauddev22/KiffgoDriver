import React from 'react';
import {
  View,
  Image as RnImage,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import {RNCamera} from 'react-native-camera';
import {Text, Image, CustomNavbar, DialogInput} from '../../components';
import {Images, Colors, AppStyles, Metrics, Fonts} from '../../theme';
import styles from './BarcodeScannerStyles';
import BottomSheet from 'reanimated-bottom-sheet';

import {Actions} from 'react-native-router-flux';
import dataTypes from '../../dataTypes';
import {TASK_FIELDS_NAME} from '../../constants';
import base64 from 'react-native-base64';
import Toast, {DURATION} from 'react-native-easy-toast';
export default function BarcodeScannerView(props) {
  const {
    torchOn,
    onBarCodeRead,
    camRef,
    handleTorch,
    showHideManualEdit,
    manualEdit,
    task,
    onSave,
    tostRef,
    pauseView,
    loading,
  } = props;
  /**
   * @type {Barcode[]}
   */
  const assignedList = _.filter(task[TASK_FIELDS_NAME.BARCODES], 'isAssigned');
  /**
   * @type {Barcode[]}
   */
  const additionalList = _.filter(task[TASK_FIELDS_NAME.BARCODES], {
    isAssigned: false,
  });

  const renderHeader = () => (
    <View style={[styles.headerWrapper]}>
      <View style={styles.sheetDraggingBtn} />
      <View style={styles.handle} />
    </View>
  );

  /**
   *
   * @param {Barcode} item
   */
  const barCodeItem = item => {
    let color = 'white';
    if (item.isAssigned && item.isCaptured !== null) {
      color = Colors.accent;
    }
    if (item.isRequired && item.isCaptured === null) {
      color = Colors.requiredCode;
    }
    return (
      <View key={item.innerId} style={styles.barcodeParent}>
        <RnImage
          source={
            color === Colors.requiredCode
              ? Images.assigned_barcode_inner_orange
              : color === Colors.accent
              ? Images.assigned_barcode_inner_green
              : Images.assigned_barcode_inner
          }
          resizeMode="contain"
          style={styles.barcodeIcon}
        />
        <View
          style={[
            AppStyles.flexRow,
            AppStyles.flex,
            AppStyles.alignItemsCenter,
          ]}>
          <Text
            color={color}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{maxWidth: Metrics.screenWidth - 100}}>
            {base64.decode(item.barcodeString)}
          </Text>
        </View>
      </View>
    );
  };
  const renderContent = () => (
    <View style={styles.btmParent}>
      <View style={[AppStyles.mTop10, AppStyles.mBottom15, AppStyles.flex]}>
        {assignedList.length > 0 && (
          <View style={AppStyles.flex}>
            <Text>Assigned Codes</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {assignedList.map(barCodeItem)}
            </ScrollView>
          </View>
        )}
        {additionalList.length > 0 && (
          <View style={[AppStyles.mTop10, AppStyles.flex]}>
            <Text>Additional Codes</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {additionalList.map(barCodeItem)}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <RNCamera
        style={styles.preview}
        onBarCodeRead={onBarCodeRead}
        ref={cam => camRef(cam)}
        captureAudio={false}
        flashMode={
          torchOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }>
        <View style={pauseView ? [styles.box, styles.redBorder] : styles.box}>
          <ActivityIndicator
            animating={false}
            color={Colors.accent}
            size="large"
            style={styles.loader}
          />
          <View style={styles.kiffgoText}>
            <Text size={Fonts.size.xv}>Kiffgo</Text>
          </View>
          <View />
        </View>
      </RNCamera>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => Actions.pop()}>
            <Text style={AppStyles.textUnderline} color={Colors.accent}>
              Done
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showHideManualEdit}>
            <Text color={Colors.accent}>Add code</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomOverlay}>
          <TouchableOpacity onPress={() => handleTorch(torchOn)}>
            <RnImage
              style={styles.cameraIcon}
              source={torchOn === true ? Images.torch_on : Images.torch_off}
            />
          </TouchableOpacity>
        </View>
      </View>
      <DialogInput
        isDialogVisible={manualEdit}
        title={'Enter Barcode'}
        submitInput={onSave}
        closeDialog={showHideManualEdit}
        submitText={'Save'}
      />
      <BottomSheet
        snapPoints={[100, 500]}
        initialSnap={0}
        enabledContentGestureInteraction={false}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />
      <Toast
        ref={tostRef}
        style={styles.toast}
        position="top"
        positionValue={250}
        fadeInDuration={100}
        fadeOutDuration={500}
        opacity={0.8}
        textStyle={styles.toastText}
      />
    </View>
  );
}
