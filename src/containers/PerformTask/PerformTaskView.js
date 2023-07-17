import React from 'react';
import {
  View,
  Image as RnImage,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import {
  Text,
  Image,
  CustomNavbar,
  TextInput,
  ButtonView,
} from '../../components';
import styles from './PerformTaskStyles';
import {activeOpacity, TASK_FIELDS_NAME, TASK_PROOFS} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Fonts, AppStyles, Images, Metrics} from '../../theme';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import KeyboardListener from 'react-native-keyboard-listener';
import base64 from 'react-native-base64';
import dataTypes from '../../dataTypes';

/**
 *
 * @param {Barcode} item
 * @param {Function} onBarcodeItemPress
 * @param {boolean} removable
 */
const barcodeItem = (item, onBarcodeItemPress, removable = false) => {
  let color = 'white';
  if (item.isAssigned && item.isCaptured !== null) {
    color = Colors.accent;
  }
  if (item.isRequired && item.isCaptured === null) {
    color = Colors.requiredCode;
  }
  return (
    <TouchableOpacity
      key={item.innerId}
      activeOpacity={removable ? activeOpacity.medium : activeOpacity.off}
      onPress={() => {
        removable ? onBarcodeItemPress(item) : {};
      }}
      style={[
        AppStyles.flexRow,
        AppStyles.mBottom5,
        AppStyles.alignItemsCenter,
        {backgroundColor: '#2c2e3c', paddingHorizontal: 5},
      ]}>
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

      <Text
        size={Fonts.size.xv}
        color={color}
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{maxWidth: Metrics.screenWidth - 100}}>
        {base64.decode(item.barcodeString)}
      </Text>
    </TouchableOpacity>
  );
};

export default function PerformTaskView(props) {
  const {
    task,
    switchTaskSuccess,
    isSuccess,
    onSignaturePress,
    onImagePress,
    imageUploading,
    signatureUploading,
    note,
    onChangeNotes,
    onSubmitPress,
    loading,
    imageError,
    signatureError,
    notesError,
    keyboardOpen,
    keyboardClose,
    isKeyboardOpen,
    barcodesError,
    onBarcodeCapturePress,
    onBarcodeItemPress,
    networkStatus,
  } = props;
  const test = _.isUndefined(task);
  let is_success = null;
  /**
   * @type {Barcode[]}
   */
  let assignedList = [];
  /**
   * @type {Barcode[]}
   */
  let additionalList;
  if (!test) {
    is_success = task.is_success;
    assignedList = _.filter(task[TASK_FIELDS_NAME.BARCODES], 'isAssigned');
    additionalList = _.filter(task[TASK_FIELDS_NAME.BARCODES], {
      isAssigned: false,
    });
  }
  if (test) {
    return null;
  }

  return (
    <View style={styles.container}>
      <KeyboardListener
        onDidShow={() => {
          keyboardOpen();
        }}
        onDidHide={() => {
          keyboardClose();
        }}
      />
      <CustomNavbar
        hasBorder={false}
        hasBack
        whiteBack
        title={`Order ID : ${task[TASK_FIELDS_NAME.INTERNAL_ORDER_NUMBER]}`}
        titleColor={Colors.text.white}
      />
      <KeyboardAwareScrollView
        style={styles.mainContainer}
        contentContainerStyle={
          !isKeyboardOpen && {paddingBottom: Metrics.tabBarHeight + 50}
        }
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}>
        {/* Contact and Location area */}
        <View style={styles.dataContainer}>
          <View>
            <View style={[styles.titleArea, styles.textView]}>
              <Text size={Fonts.size.xiii} style={styles.titleText}>
                CONTACT AND LOCATION:
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text size={Fonts.size.xiv}>
                {task[TASK_FIELDS_NAME.RECIPIENT_NAME]}
              </Text>
            </View>
            {_.isEmpty(task[TASK_FIELDS_NAME.LOCATION_BUSINESS_NAME]) &&
              _.isEmpty(task[TASK_FIELDS_NAME.STREET_NUMBER]) &&
              _.isEmpty(task[TASK_FIELDS_NAME.STREET_NAME]) &&
              _.isEmpty(task[TASK_FIELDS_NAME.LOCATION_BUILDING]) &&
              _.isEmpty(task[TASK_FIELDS_NAME.LOCATION_CITY]) &&
              _.isEmpty(task[TASK_FIELDS_NAME.LOCATION_POSTCODE]) &&
              _.isEmpty(task[TASK_FIELDS_NAME.COUNTRY_NAME]) && (
                <Text size={Fonts.size.xv}>
                  {task[TASK_FIELDS_NAME.LOCATION_ADDRESS]}
                </Text>
              )}
            {!_.isEmpty(task[TASK_FIELDS_NAME.LOCATION_BUSINESS_NAME]) && (
              <Text
                size={Fonts.size.xv}
                style={[styles.boldText, styles.textView]}>
                {task[TASK_FIELDS_NAME.LOCATION_BUSINESS_NAME]}
              </Text>
            )}
            <View style={[AppStyles.flex, AppStyles.flexRow]}>
              {!_.isEmpty(task[TASK_FIELDS_NAME.STREET_NUMBER]) && (
                <Text size={Fonts.size.xv}>
                  {task[TASK_FIELDS_NAME.STREET_NUMBER] + ' , '}
                </Text>
              )}
              {!_.isEmpty(task[TASK_FIELDS_NAME.STREET_NAME]) && (
                <Text size={Fonts.size.xv}>
                  {task[TASK_FIELDS_NAME.STREET_NAME]}
                </Text>
              )}
            </View>

            {!_.isEmpty(task[TASK_FIELDS_NAME.LOCATION_BUILDING]) && (
              <Text size={Fonts.size.xv}>
                {task[TASK_FIELDS_NAME.LOCATION_BUILDING]}
              </Text>
            )}

            <View style={[AppStyles.flex, AppStyles.flexRow]}>
              {!_.isEmpty(task[TASK_FIELDS_NAME.LOCATION_CITY]) && (
                <Text size={Fonts.size.xv}>
                  {task[TASK_FIELDS_NAME.LOCATION_CITY] + ' , '}
                </Text>
              )}
              {!_.isEmpty(task[TASK_FIELDS_NAME.LOCATION_POSTCODE]) && (
                <Text size={Fonts.size.xv}>
                  {task[TASK_FIELDS_NAME.LOCATION_POSTCODE]}
                </Text>
              )}
            </View>

            {!_.isEmpty(task[TASK_FIELDS_NAME.COUNTRY_NAME]) && (
              <Text size={Fonts.size.xv}>
                {task[TASK_FIELDS_NAME.COUNTRY_NAME]}
              </Text>
            )}
          </View>
        </View>
        {/* Task Completed */}
        <View style={[AppStyles.mTop30]}>
          <View>
            <View style={[styles.titleArea, styles.textView]}>
              <Text size={Fonts.size.xiii} style={styles.titleText}>
                TASK COMPLETED
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                switchTaskSuccess(true);
              }}
              style={styles.rowView}
              activeOpacity={activeOpacity.medium}>
              <View style={styles.dotLabelView}>
                <View
                  style={[styles.circleView, {backgroundColor: Colors.accent}]}
                />
                <Text type={is_success ? 'bold' : 'base'} size={Fonts.size.xiv}>
                  Success
                </Text>
              </View>
              <RnImage
                style={styles.tickIcon}
                source={is_success ? Images.tickGreen : Images.whiteRightArrow}
              />
            </TouchableOpacity>
            <ButtonView
              touchableOpacityView
              onPress={() => {
                Actions.failureReason({taskId: task.id});
              }}
              style={[styles.rowView, AppStyles.mTop20]}
              activeOpacity={activeOpacity.medium}>
              <View style={styles.dotLabelView}>
                <View style={styles.circleView} />
                <Text
                  type={!is_success ? 'bold' : 'base'}
                  size={Fonts.size.xiv}>
                  Failure
                </Text>
              </View>
              <Text size={Fonts.size.xiii} color={'#ff2c2c'}>
                {task[TASK_FIELDS_NAME.REASON]}
              </Text>
              <RnImage
                style={!is_success ? styles.crossIcon : styles.tickIcon}
                source={!is_success ? Images.crossRed : Images.whiteRightArrow}
              />
            </ButtonView>
          </View>
        </View>
        {/* pics & signature */}
        <Text
          size={Fonts.size.xiii}
          color={Colors.accent}
          style={[AppStyles.mTop30]}>
          REQUIREMENTS
        </Text>
        <View style={styles.camSigParent}>
          <View style={AppStyles.flex10}>
            <View style={styles.requiredLabel}>
              {imageError && (
                <Text size={Fonts.size.xiii} color={'#ffb484'}>
                  Required
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={onImagePress}
              activeOpacity={activeOpacity.medium}>
              {task[TASK_FIELDS_NAME.PICTURE].length < 1 && !imageUploading && (
                <View style={styles.camParent}>
                  <View style={styles.camStripVertical} />
                  <View style={styles.camStripHorizontal} />
                  <View style={styles.iconTextParent}>
                    <RnImage source={Images.camera} style={styles.camIcon} />
                    <Text
                      size={Fonts.size.xii}
                      color={Colors.text.grey}
                      type="italic"
                      style={AppStyles.mTop5}>
                      New picture
                    </Text>
                  </View>
                </View>
              )}

              {task[TASK_FIELDS_NAME.PICTURE].length > 0 && !imageUploading && (
                <View style={styles.picImageParent}>
                  <Image
                    resizeMode="contain"
                    source={
                      task[TASK_FIELDS_NAME.PICTURE][
                        task[TASK_FIELDS_NAME.PICTURE].length - 1
                      ].isLocal
                        ? {
                            uri:
                              task[TASK_FIELDS_NAME.PICTURE][
                                task[TASK_FIELDS_NAME.PICTURE].length - 1
                              ].path,
                          }
                        : {
                            uri:
                              task[TASK_FIELDS_NAME.PICTURE][
                                task[TASK_FIELDS_NAME.PICTURE].length - 1
                              ].secure_url,
                          }
                    }
                    style={styles.picImage}
                  />
                </View>
              )}
              {imageUploading && (
                <View style={[styles.picImageParent, styles.camParent]}>
                  <View style={styles.camStripVertical} />
                  <View style={styles.camStripHorizontal} />
                  <View style={styles.iconTextParent}>
                    <ActivityIndicator color={Colors.accent} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* barcode scanner */}
          <View style={{flex: 1}} />
          <View style={AppStyles.flex10}>
            <View style={styles.requiredLabel}>
              {barcodesError && (
                <Text size={Fonts.size.xiii} color={'#ffb484'}>
                  Required
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={onBarcodeCapturePress}
              activeOpacity={activeOpacity.medium}>
              <View style={styles.camParent}>
                <View style={styles.camStripVertical} />
                <View style={styles.camStripHorizontal} />
                <View style={styles.iconTextParent}>
                  <RnImage source={Images.barCode} style={styles.camIcon} />
                  <Text
                    size={Fonts.size.xii}
                    color={Colors.text.grey}
                    type="italic"
                    style={AppStyles.mTop5}>
                    Scanner
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* signature */}
          <View style={{flex: 1}} />
          <View style={AppStyles.flex10}>
            <View style={styles.requiredLabel}>
              {signatureError && (
                <Text size={Fonts.size.xiii} color={'#ffb484'}>
                  Required
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={onSignaturePress}
              activeOpacity={activeOpacity.medium}>
              {_.isEmpty(task[TASK_FIELDS_NAME.SIGNATURE]) &&
                !signatureUploading && (
                  <View style={styles.sigParent}>
                    <View style={styles.sigStripVertical} />
                    <View style={styles.sigStripHorizontal} />
                    <View style={styles.iconTextParent}>
                      <RnImage
                        source={Images.signature}
                        style={styles.camIcon}
                      />
                      <Text
                        numberOfLines={1}
                        size={Fonts.size.xii}
                        color={Colors.text.grey}
                        type="italic"
                        style={AppStyles.mTop5}>
                        New signature
                      </Text>
                    </View>
                  </View>
                )}
              {!_.isEmpty(task[TASK_FIELDS_NAME.SIGNATURE]) &&
                !signatureUploading && (
                  <View>
                    <View style={styles.signatureImageParent}>
                      <Image
                        resizeMode="contain"
                        source={
                          task.signature.isLocal
                            ? {uri: task.signature.uri}
                            : {uri: task.signature.secure_url}
                        }
                        style={styles.sigImage}
                      />
                    </View>
                  </View>
                )}
              {signatureUploading && (
                <View
                  style={[
                    styles.signLoadingParent,
                    styles.camSignLoadingParent,
                  ]}>
                  <View style={styles.sigStripVertical} />
                  <View style={styles.sigStripHorizontal} />
                  <View style={styles.iconTextParent}>
                    <ActivityIndicator color={Colors.accent} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* Assigned barcode */}
        {assignedList.length > 0 && (
          <View style={[AppStyles.mTop20]}>
            <View style={[styles.titleArea, styles.textView]}>
              <Text size={Fonts.size.xiii} style={styles.titleText}>
                {`ASSIGNED BARCODES ${
                  assignedList.length > 1 ? '(' + assignedList.length + ')' : ''
                }`}
              </Text>
            </View>
            <View>
              {assignedList.map(item => barcodeItem(item, onBarcodeItemPress))}
            </View>
          </View>
        )}
        {/* Additional barcode */}
        {additionalList.length > 0 && (
          <View style={[AppStyles.mTop10]}>
            <View style={[styles.titleArea, styles.textView]}>
              <Text size={Fonts.size.xiii} style={styles.titleText}>
                {`ADDITIONAL BARCODES SCANNED ${
                  additionalList.length > 1
                    ? '(' + additionalList.length + ')'
                    : ''
                }`}
              </Text>
            </View>
            <View>
              {additionalList.map(item =>
                barcodeItem(item, onBarcodeItemPress, true),
              )}
            </View>
          </View>
        )}
        {/* Notes */}
        <View style={[AppStyles.mTop10]}>
          <View>
            <View
              style={[
                styles.titleArea,
                styles.textView,
                {alignItems: 'flex-end'},
              ]}>
              <Text size={Fonts.size.xiii} style={styles.titleText}>
                NOTES
              </Text>
              {notesError && (
                <Text size={Fonts.size.xiii} color={'#ffb484'}>
                  Required
                </Text>
              )}
            </View>
            <View>
              <TextInput
                onChangeText={onChangeNotes}
                value={note}
                multiline
                placeholder="Type here"
              />
            </View>
          </View>
        </View>
        {isKeyboardOpen && (
          <TouchableOpacity
            onPress={onSubmitPress}
            activeOpacity={activeOpacity.medium}
            style={[styles.submitButton, AppStyles.mTop30]}>
            <LinearGradient
              style={styles.submitButton}
              colors={
                task[TASK_FIELDS_NAME.IS_SUCCESS]
                  ? Colors.greenGradient
                  : Colors.redGradient
              }>
              {!loading && (
                <Text type="bold" size={Fonts.size.xviii}>
                  {task[TASK_FIELDS_NAME.IS_SUCCESS]
                    ? 'Complete with success'
                    : 'Complete with failure'}
                </Text>
              )}
              {loading && <ActivityIndicator color={Colors.white} />}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>
      {isKeyboardOpen == false && (
        <LinearGradient
          style={{
            padding: Metrics.baseMargin,
            width: '100%',
            position: 'absolute',
            bottom: 0,
          }}
          colors={Colors.tranparentGradient}>
          <TouchableOpacity
            onPress={onSubmitPress}
            activeOpacity={activeOpacity.medium}
            style={[styles.submitButton]}>
            <LinearGradient
              style={styles.submitButton}
              colors={
                task[TASK_FIELDS_NAME.IS_SUCCESS]
                  ? Colors.greenGradient
                  : Colors.redGradient
              }>
              {!loading && (
                <Text type="bold" size={Fonts.size.xviii}>
                  {task[TASK_FIELDS_NAME.IS_SUCCESS]
                    ? 'Complete with success'
                    : 'Complete with failure'}
                </Text>
              )}
              {loading && <ActivityIndicator color={Colors.white} />}
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
}
