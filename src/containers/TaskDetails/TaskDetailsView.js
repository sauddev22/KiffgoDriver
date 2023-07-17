import React from 'react';
import _, {isEmpty} from 'lodash';
import {
  View,
  Image as RnImage,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {Text, Image, CustomNavbar, AnimatedButton} from '../../components';
import styles from './TaskDetailsStyles';
import {
  activeOpacity,
  TASK_FIELDS_NAME,
  TASK_STATUS,
  DATE_FORMAT5,
  TIME_FORMAT1,
} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Images, Fonts, AppStyles, Metrics} from '../../theme';
import {ScrollView} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import MapAlertView from './MapAlertView';
import Util from '../../util';
import {Actions} from 'react-native-router-flux';
import moment from 'moment-timezone';
import base64 from 'react-native-base64';
import util from '../../util';

export default function TaskDetailsView(props) {
  const {
    mapSheetRef,
    onLocationButton,
    onLongPressButton,
    startTaskAndNavigate,
    mapClick,
    openDialScreen,
    task,
    taskInTransit,
    loading,
    completed,
    startRouteModalVisible,
    startRouteLoading,
    startRouteRequest,
    closeRouteModal,
  } = props;

  /**
   * @type {Barcode[]}
   */
  let barcode = [];
  if (task) {
    barcode = task[TASK_FIELDS_NAME.BARCODES].filter(item => item.isAssigned);
  }
  /**
   * @type {Barcode[]}
   */
  let assignedListTimeLine = [];
  if (task) {
    assignedListTimeLine = task[TASK_FIELDS_NAME.BARCODES].filter(
      item => item.isAssigned && item.isCaptured != null,
    );
  }
  /**
   * @type {Barcode[]}
   */
  let additionalListTimeLine = [];
  if (task) {
    additionalListTimeLine = task[TASK_FIELDS_NAME.BARCODES].filter(
      item => !item.isAssigned,
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.background.primary} />
      <CustomNavbar
        hasBorder={false}
        hasBack
        whiteBack
        title={`Order ID : ${
          task ? task[TASK_FIELDS_NAME.INTERNAL_ORDER_NUMBER] : ' - '
        } `}
        titleColor={Colors.text.white}
        rightBtnText={completed ? 'Close' : ''}
        rightBtnPress={() => (completed ? Actions.reset('dashboard') : {})}
      />
      {!task && <ActivityIndicator size="large" style={AppStyles.mBottom20} />}
      {task && (
        <View style={AppStyles.flex}>
          <ScrollView
            style={styles.mainContainer}
            contentContainerStyle={{
              paddingBottom: Metrics.tabBarHeight + 50,
            }}>
            {/* Location Area */}
            <View style={[styles.dataContainer, AppStyles.mTop0]}>
              <View style={styles.infoArea}>
                <View style={[styles.titleArea, styles.textView]}>
                  <RnImage
                    resizeMode="contain"
                    style={styles.titleIcon}
                    source={Images.locationGreen}
                  />
                  <Text size={Fonts.size.xiii} style={styles.titleText}>
                    LOCATION
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

                <Text
                  size={Fonts.size.xiv}
                  style={[styles.boldText, AppStyles.mTop5]}>
                  Location notes:
                </Text>
                <Text size={Fonts.size.xiv}>
                  {task[TASK_FIELDS_NAME.DESTINATION_NOTES]}
                </Text>
              </View>
              <View style={styles.buttonArea}>
                <TouchableOpacity
                  activeOpacity={activeOpacity.medium}
                  style={styles.buttonParent}
                  onPress={startTaskAndNavigate}>
                  <LinearGradient
                    style={styles.button}
                    colors={Colors.greenGradient}>
                    <RnImage
                      resizeMode="contain"
                      style={styles.locationIcon}
                      source={Images.locationArrow}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            {/* Contact area */}

            <View style={styles.dataContainer}>
              <View style={styles.infoArea}>
                <View style={[styles.titleArea, styles.textView]}>
                  <RnImage
                    resizeMode="contain"
                    style={styles.titleIcon}
                    source={Images.contactUser}
                  />
                  <Text size={Fonts.size.xiii} style={styles.titleText}>
                    CONTACT
                  </Text>
                </View>
                <Text
                  size={Fonts.size.xiv}
                  style={[styles.boldText, styles.textView]}>
                  {task[TASK_FIELDS_NAME.RECIPIENT_NAME]}
                </Text>
                <Text size={Fonts.size.xiv} style={[styles.boldText]}>
                  Contact notes:
                </Text>
                <Text size={Fonts.size.xiv}>
                  {task[TASK_FIELDS_NAME.RECIPIENT_NOTES]}
                </Text>
              </View>
              {!_.isEmpty(task[TASK_FIELDS_NAME.RECIPIENT_PHONE]) && (
                <View style={styles.buttonArea}>
                  <TouchableOpacity
                    activeOpacity={activeOpacity.medium}
                    style={[styles.buttonParent, AppStyles.mRight20]}
                    onPress={openDialScreen}>
                    <LinearGradient
                      style={styles.button}
                      colors={Colors.greenGradient}>
                      <RnImage
                        resizeMode="contain"
                        style={styles.arrowIcon}
                        source={Images.phoneRinging}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={activeOpacity.medium}
                    style={styles.buttonParent}
                    onPress={() => {
                      Linking.openURL(
                        `sms:${task[TASK_FIELDS_NAME.RECIPIENT_PHONE]}`,
                      );
                    }}>
                    <LinearGradient
                      style={styles.button}
                      colors={Colors.greenGradient}>
                      <RnImage
                        resizeMode="contain"
                        style={styles.arrowIcon}
                        source={Images.message}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
              {_.isEmpty(task[TASK_FIELDS_NAME.RECIPIENT_PHONE]) && (
                <View style={styles.buttonArea}>
                  <View
                    activeOpacity={activeOpacity.medium}
                    style={[styles.disabledButton, AppStyles.mRight20]}
                    onPress={() => {}}>
                    <RnImage
                      resizeMode="contain"
                      style={styles.arrowIcon}
                      source={Images.phoneRinging}
                    />
                  </View>
                  <View
                    activeOpacity={activeOpacity.medium}
                    style={styles.disabledButton}
                    onPress={() => {}}>
                    <RnImage
                      resizeMode="contain"
                      style={styles.arrowIcon}
                      source={Images.message}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Task Scheduled area */}
            {(!_.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_AFTER]) ||
              !_.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_BEFORE])) && (
              <View style={styles.dataContainer}>
                <View>
                  <View style={[styles.titleArea, styles.textView]}>
                    <RnImage
                      resizeMode="contain"
                      style={styles.titleIcon}
                      source={Images.clock}
                    />
                    <Text size={Fonts.size.xiii} style={styles.titleText}>
                      DELIVERY TIME WINDOW
                    </Text>
                  </View>

                  <View>
                    {!_.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_AFTER]) &&
                      _.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_BEFORE]) && (
                        <View style={AppStyles.flexRow}>
                          <Text size={Fonts.size.xiv}>
                            Complete After:{' '}
                            {Util.dateParserTwo(
                              task[TASK_FIELDS_NAME.COMPLETE_AFTER],
                            )}
                          </Text>
                        </View>
                      )}

                    {!_.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_BEFORE]) &&
                      _.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_AFTER]) && (
                        <View style={AppStyles.flexRow}>
                          <Text size={Fonts.size.xiv}>
                            Complete Before:{' '}
                            {Util.dateParserTwo(
                              task[TASK_FIELDS_NAME.COMPLETE_BEFORE],
                            )}
                          </Text>
                        </View>
                      )}
                    {!_.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_BEFORE]) &&
                      !_.isEmpty(task[TASK_FIELDS_NAME.COMPLETE_AFTER]) && (
                        <View style={[AppStyles.flexRow]}>
                          <Text size={Fonts.size.xiv}>
                            Between{' '}
                            {Util.dateParserTwo(
                              task[TASK_FIELDS_NAME.COMPLETE_AFTER],
                            )}{' '}
                            &{' '}
                            {Util.dateParserTwo(
                              task[TASK_FIELDS_NAME.COMPLETE_BEFORE],
                            )}
                          </Text>
                        </View>
                      )}
                  </View>
                </View>
              </View>
            )}

            {/* Task Detail area */}
            <View style={styles.dataContainer}>
              <View>
                <View style={[styles.titleArea, styles.textView]}>
                  <RnImage
                    resizeMode="contain"
                    style={styles.titleIcon}
                    source={Images.box}
                  />
                  <Text size={Fonts.size.xiii} style={styles.titleText}>
                    TASK DETAIL
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text size={Fonts.size.xv}>
                    {task[TASK_FIELDS_NAME.IS_DROPOFF] ? 'Dropoff' : 'Pickup'}
                  </Text>
                  <RnImage
                    source={
                      task[TASK_FIELDS_NAME.IS_DROPOFF]
                        ? Images.drop
                        : Images.pick
                    }
                    style={styles.pickDropIcon}
                  />
                </View>
                <Text size={Fonts.size.xiv}>
                  Task : {task[TASK_FIELDS_NAME.TASK_NUMBER]}{' '}
                </Text>
                <Text size={Fonts.size.xiv}>
                  Quantity : {task[TASK_FIELDS_NAME.QUANTITY]}
                </Text>
                <Text size={Fonts.size.xiv}>
                  Description : {task[TASK_FIELDS_NAME.DESCRIPTION]}
                </Text>
              </View>
            </View>
            {/* Assigned barcode area */}
            {barcode.length > 0 && (
              <View style={styles.dataContainer}>
                <View>
                  <View style={[styles.titleArea, styles.textView]}>
                    <RnImage
                      resizeMode="contain"
                      style={styles.titleIcon}
                      source={Images.assigned_barcode}
                    />
                    <Text size={Fonts.size.xiii} style={styles.titleText}>
                      {`ASSIGNED BARCODES ${
                        barcode.length > 1 ? '(' + barcode.length + ')' : ''
                      }`}
                    </Text>
                  </View>
                  <View>
                    {barcode
                      .filter(item => item.isAssigned)
                      .map((item, index) => {
                        return (
                          <View
                            key={item.innerId}
                            style={[AppStyles.flexRow, AppStyles.mTop5]}>
                            <Text size={Fonts.size.xiv}>
                              {base64.decode(item.barcodeString)}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                </View>
              </View>
            )}

            {/* Completed Task only */}
            {(task[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.SUCCESS ||
              task[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.FAIL) && (
              <View>
                {/* Task Detail area */}
                <View style={styles.dataContainer}>
                  <View>
                    <View style={[styles.titleArea, styles.textView]}>
                      <RnImage
                        resizeMode="contain"
                        style={styles.titleIcon}
                        source={Images.taskMetric}
                      />
                      <Text size={Fonts.size.xiii} style={styles.titleText}>
                        TASK METRICS
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text size={Fonts.size.xiv} type={'bold'}>
                        Duration :{' '}
                      </Text>
                      <Text size={Fonts.size.xiv}>
                        {moment
                          .utc(
                            moment
                              .duration(
                                task[TASK_FIELDS_NAME.DURATION],
                                'seconds',
                              )
                              .asMilliseconds(),
                          )
                          .format(TIME_FORMAT1)}
                      </Text>
                    </View>
                  </View>
                </View>
                {!_.isEmpty(task[TASK_FIELDS_NAME.TIMELINE]) && (
                  <View style={[styles.dataContainer]}>
                    <View style={styles.infoArea}>
                      <View style={[styles.titleArea, styles.textView]}>
                        <RnImage
                          resizeMode="contain"
                          style={styles.titleIcon}
                          source={Images.timeline}
                        />
                        <Text size={Fonts.size.xiii} style={styles.titleText}>
                          TIMELINE
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                {/* Timeline */}
                <View>
                  {task[TASK_FIELDS_NAME.TIMELINE].map(item => {
                    return (
                      <View
                        key={util.generateGuid()}
                        style={styles.timeLineItemParent}>
                        <View style={styles.circleView} />
                        {item.key !== 'task_ended' && (
                          <View style={styles.lineView} />
                        )}
                        <View
                          style={[
                            AppStyles.flex,
                            AppStyles.mLeft10,
                            {paddingBottom: 20},
                          ]}>
                          <Text size={Fonts.size.xiii}>
                            {item.key === 'added_barcode'
                              ? item.title +
                                '(' +
                                (assignedListTimeLine.length +
                                  additionalListTimeLine.length) +
                                ')'
                              : item.title}
                          </Text>
                          <Text type="italic" size={Fonts.size.xiii}>
                            {moment(
                              item.key === 'picture_added' ||
                                item.key === 'signature_added'
                                ? JSON.parse(item.value).time
                                : item.updatedAt,
                            ).format(DATE_FORMAT5)}
                          </Text>
                          {item.key === 'added_barcode' && (
                            <View>
                              {assignedListTimeLine.length > 0 && (
                                <View style={[AppStyles.mLeft5]}>
                                  <Text type="bold" size={Fonts.size.xi}>
                                    Assigned
                                  </Text>
                                  {assignedListTimeLine.map(code => (
                                    <Text size={Fonts.size.x}>
                                      {base64.decode(code.barcodeString)}
                                    </Text>
                                  ))}
                                </View>
                              )}
                              {additionalListTimeLine.length > 0 && (
                                <View
                                  style={[AppStyles.mLeft5, AppStyles.mTop5]}>
                                  <Text type="bold" size={Fonts.size.xi}>
                                    Additionals
                                  </Text>
                                  {additionalListTimeLine.map(code => (
                                    <Text size={Fonts.size.xi}>
                                      {base64.decode(code.barcodeString)}
                                    </Text>
                                  ))}
                                </View>
                              )}
                            </View>
                          )}
                          {item.key === 'picture_added' && (
                            <View>
                              <FlatList
                                horizontal
                                data={task[TASK_FIELDS_NAME.PICTURE]}
                                renderItem={pic => {
                                  return (
                                    <View
                                      style={[
                                        AppStyles.padding5,
                                        AppStyles.mTop5,
                                      ]}>
                                      <Image
                                        resizeMode="contain"
                                        source={{uri: pic.item.secure_url}}
                                        style={styles.timelineImage}
                                      />
                                    </View>
                                  );
                                }}
                              />
                            </View>
                          )}
                          {item.key === 'signature_added' && (
                            <View style={styles.timelineSignatureParent}>
                              <Image
                                source={{
                                  uri:
                                    task[TASK_FIELDS_NAME.SIGNATURE].secure_url,
                                }}
                                style={styles.signatureImage}
                                resizeMode="contain"
                              />
                            </View>
                          )}
                          {item.key === 'note_added' && (
                            <Text size={Fonts.size.xiii}>
                              {JSON.parse(item.value).note}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <RBSheet
              animationType="fade"
              ref={ref => {
                mapSheetRef(ref);
              }}
              closeOnDragDown={true}
              height={Metrics.screenHeight / 2.5}
              duration={250}
              customStyles={{
                container: styles.bottomSheetContainer,
              }}>
              <MapAlertView task={props.task} mapOnClick={mapClick} />
            </RBSheet>
          </ScrollView>

          {task[TASK_FIELDS_NAME.STATUS] !== TASK_STATUS.SUCCESS &&
            task[TASK_FIELDS_NAME.STATUS] !== TASK_STATUS.FAIL && (
              <LinearGradient
                style={{
                  padding: Metrics.baseMargin,
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                }}
                colors={Colors.tranparentGradient}>
                {task[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.ASSIGNED &&
                  !taskInTransit && (
                    <AnimatedButton
                      loading={loading}
                      text="Hold to Start"
                      onPress={onLongPressButton}
                    />
                  )}
                {task[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.ASSIGNED &&
                  taskInTransit && (
                    <TouchableOpacity
                      activeOpacity={activeOpacity.off}
                      style={styles.longPressButton}>
                      <LinearGradient
                        style={styles.longPressButtonLinear}
                        colors={Colors.greyGradient}>
                        <Text type="bold" size={Fonts.size.xviii}>
                          Another Task is active
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                {task[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.IN_TRANSIT && (
                  <TouchableOpacity
                    onPress={() =>
                      Actions.performTask({taskId: task[TASK_FIELDS_NAME.ID]})
                    }
                    activeOpacity={activeOpacity.medium}
                    style={styles.longPressButton}>
                    <LinearGradient
                      style={styles.longPressButtonLinear}
                      colors={Colors.greenGradient}>
                      <Text type="bold" size={Fonts.size.xviii}>
                        Tap to complete
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            )}
        </View>
      )}
      <Modal
        transparent
        visible={startRouteModalVisible}
        onRequestClose={() => {}}
        animationType={'slide'}>
        <View style={styles.modalCenterView}>
          <View style={styles.modalContentView}>
            <View style={styles.closeButton}>
              <TouchableOpacity onPress={closeRouteModal}>
                <Image source={Images.cross} style={{height: 27, width: 27}} />
              </TouchableOpacity>
            </View>
            <Text type="bold" size={Fonts.size.xvii}>
              Start Today's Route
            </Text>
            <Text
              size={Fonts.size.xv}
              textAlign="center"
              style={AppStyles.mTop10}>
              Starting a route will allow you to complete task(s) even in area
              without internet. Dispatcher won't be able to make any changes to
              your current route once route is started.You can end the route by
              going off-duty.
            </Text>
            <View style={{width: '100%', marginTop: 40}}>
              <AnimatedButton
                loading={startRouteLoading}
                text="Hold To Start Route"
                onPress={startRouteRequest}
                buttonColors={[Colors.greenGradient, Colors.blueGradient]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
