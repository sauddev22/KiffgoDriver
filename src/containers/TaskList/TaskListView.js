import React from 'react';
import {
  View,
  Switch,
  StatusBar,
  Image as RnImage,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment-timezone';
import {
  TaskItem,
  Text,
  Loader,
  TextInput,
  AnimatedButton,
  Image,
} from '../../components';
import styles from './TaskListStyles';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {Colors, Images, Fonts, Metrics, AppStyles} from '../../theme';
import {activeOpacity, USER_FIELDS_NAME, TASK_STATUS} from '../../constants';
import {Actions} from 'react-native-router-flux';
import BottomSheet from 'reanimated-bottom-sheet';

function renderItem(item) {
  return <TaskItem item={item} />;
}
const renderHeader = () => (
  <View style={[styles.headerWrapper]}>
    <View style={styles.sheetDraggingBtn} />
    <View style={styles.handle} />
  </View>
);
export default function TaskListView(props) {
  const {
    total,
    selectedTab,
    loading,
    toggleSwitch,
    tabClick,
    taskList,
    flatListRef,
    user,
    onDragDone,
    bsRef,
    fileBottomSheetSubmit,
    showHelpSheet,
    networkStatus,
    routeStartBsRef,
    routeEndBsRef,
    startRouteSheetSubmit,
    startRouteLoading,
    onFileSheetStateChange,
    isSyncing,
    endRouteModalVisible,
    closeEndRouteModal,
  } = props;

  return (
    <KeyboardAvoidingView behavior="height" enabled style={styles.container}>
      <StatusBar
        backgroundColor={Colors.black}
        barStyle="light-content"
        translucent={true}
      />
      <Loader
        loading={isSyncing}
        backdropOpacity={0.6}
        loadingFor="Syncing tasks please wait"
      />
      <Loader loading={loading} backdropOpacity={0.6} />
      <View style={styles.DriverStatusContainer}>
        <TouchableOpacity
          style={styles.historyView}
          onPress={() => Actions.taskHistory()}>
          <RnImage source={Images.taskHistory} style={styles.historyIcon} />
        </TouchableOpacity>
        <View style={styles.StatusSwitch}>
          <RnImage
            resizeMode="contain"
            style={styles.userIcon}
            source={Images.offlineUser}
          />
          <Switch
            trackColor={{false: Colors.grey, true: Colors.accent}}
            thumbColor={
              props.user[USER_FIELDS_NAME.IS_ONLINE]
                ? Colors.white
                : Colors.white
            }
            ios_backgroundColor={Colors.grey}
            onValueChange={toggleSwitch}
            value={props.user[USER_FIELDS_NAME.IS_ONLINE]}
          />
          <RnImage
            resizeMode="contain"
            style={styles.userIcon}
            source={Images.onlineUser}
          />
        </View>

        <TouchableOpacity
          onPress={showHelpSheet}
          activeOpacity={activeOpacity.medium}
          style={styles.help}>
          <Text size={Fonts.size.xv}>Help</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        {props.user[USER_FIELDS_NAME.IS_ONLINE] && (
          <View style={AppStyles.flex}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                onPress={() => tabClick(1)}
                activeOpacity={activeOpacity.low}
                style={selectedTab === 1 ? styles.tabSelected : styles.tab}>
                <Text size={Fonts.size.xv}>TODAY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => tabClick(2)}
                activeOpacity={activeOpacity.low}
                style={selectedTab === 2 ? styles.tabSelected : styles.tab}>
                <Text size={Fonts.size.xv}>ALL</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.listSummary}>
              <Text size={Fonts.size.xii} color={Colors.task.assigned}>
                {`${total} TASK(S) TO DO `}
                <Text
                  size={Fonts.size.xii}
                  color={networkStatus ? Colors.task.success : Colors.red}>{`${
                  networkStatus ? '  ON LINE ' : '  OFFLINE'
                }`}</Text>
                {/* <Text
                  size={Fonts.size.xii}
                  color={Colors.task.success}>{`${success} SUCCEEDED, `}</Text> */}
                {/* <Text
                  size={Fonts.size.xii}
                  color={Colors.task.assigned}>{`${todo} TODO, `}</Text> */}
                {/* <Text
                  size={Fonts.size.xii}
                  color={Colors.task.fail}>{`${fail} FAILED`}</Text> */}
              </Text>
            </View>

            <DraggableFlatList
              dragItemOverflow={false}
              autoscrollThreshold={200}
              autoscrollSpeed={150}
              containerOffset={0}
              ref={ref => flatListRef(ref)}
              scrollEnabled
              loading={true}
              disableVirtualization
              maxToRenderPerBatch={8}
              contentContainerStyle={styles.flatListContentContainer}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `draggable-item-${item.sequence}`}
              ListEmptyComponent={() => {
                if (loading) return null;
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      flex: 1,
                      height:
                        Metrics.screenHeight / 2 + Metrics.statusBarHeight,
                    }}>
                    <View
                      style={[AppStyles.centerInner, styles.offlineContainer]}>
                      <View style={styles.offDutyIconContainer}>
                        <RnImage
                          resizeMode="contain"
                          style={styles.allDoneIcon}
                          source={Images.allDone}
                        />
                      </View>
                      <Text
                        size={Fonts.size.large}
                        style={{fontFamily: Fonts.type.extraBold}}>
                        All done
                      </Text>
                      <Text
                        size={Fonts.size.medium}
                        style={styles.offlineMessage}>
                        You have no tasks assigned or all of your tasks were
                        completed. We’ll notify you when new tasks arrive.
                      </Text>
                    </View>
                  </View>
                );
              }}
              data={taskList.filter(item => {
                if (item.completeAfter) {
                  const taskDate = moment(item.completeAfter);
                  const today = moment();
                  const isToday = taskDate.isSame(today, 'd');

                  if (selectedTab === 1) {
                    if (isToday) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    return true;
                  }
                } else {
                  return true;
                }
              })}
              getItemLayout={(data, index) => ({
                length: 86,
                offset: 86 * index,
                index,
              })}
              renderItem={renderItem}
              onDragEnd={({data, from, to}) => onDragDone(data, from, to)}
            />
          </View>
        )}

        {user.user && !user[USER_FIELDS_NAME.IS_ONLINE] && (
          <View style={styles.offlineContainer}>
            <View style={styles.offDutyIconContainer}>
              <RnImage
                resizeMode="contain"
                style={styles.offlineIcon}
                source={Images.offDuty}
              />
            </View>
            <Text
              size={Fonts.size.large}
              style={{fontFamily: Fonts.type.extraBold}}>
              Go on duty with
            </Text>
            <Text
              size={Fonts.size.large}
              style={{fontFamily: Fonts.type.extraBold}}>
              {user.user.business_name}
            </Text>
            <Text size={Fonts.size.medium} style={styles.offlineMessage}>
              Go on duty with {user.user.business_name} to report your location
              and see a list of your assigned tasks. Your location will not be
              tracked while off duty.
            </Text>
          </View>
        )}
      </View>

      <BottomSheet
        ref={ref => bsRef(ref)}
        snapPoints={[0, 400]}
        initialSnap={0}
        enabledContentGestureInteraction={false}
        onOpenStart={() => {
          onFileSheetStateChange(false);
        }}
        onCloseEnd={() => {
          onFileSheetStateChange(true);
        }}
        renderContent={() => {
          return (
            <View style={styles.btmParent}>
              <Text type="bold" size={Fonts.size.xvii}>
                Report a bug or request a feature
              </Text>
              <Text
                size={Fonts.size.xv}
                textAlign="center"
                style={AppStyles.mTop10}>
                Delivery drivers face a lot challenges to deliver on time. We
                know it. We are here listen and help. Report to Kiffgo team any
                bugs or a feature suggestion and if selected win a Amazon
                voucher.
              </Text>
              <TextInput
                placeholder="I would like to see what time I am going to get home.
                The number of hours I have been working….
                "
                inputStyles={styles.textArea}
                selectionColor={'white'}
                multiline
                value={props.comment}
                containerStyle={{width: '100%', marginTop: 10}}
                onChangeText={text => {
                  props.onCommentTextChange(text);
                }}
              />
              <View
                style={{
                  selfAlign: 'flex-end',
                  marginRight: 20,
                  width: '100%',
                }}>
                <Text textAlign="right" size={Fonts.size.xi}>{`${
                  props.comment.length
                }/500`}</Text>
              </View>

              <TouchableOpacity
                onPressOut={fileBottomSheetSubmit}
                onPress={fileBottomSheetSubmit}
                activeOpacity={activeOpacity.medium}
                style={[styles.submitButton]}>
                <LinearGradient
                  style={styles.submitButton}
                  colors={Colors.greenGradient}>
                  <Text type="bold" size={Fonts.size.xviii}>
                    Submit
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          );
        }}
        renderHeader={renderHeader}
      />

      <BottomSheet
        ref={ref => routeStartBsRef(ref)}
        snapPoints={[0, 300]}
        initialSnap={0}
        enabledContentGestureInteraction={false}
        renderContent={() => {
          return (
            <View style={styles.btmParent}>
              <Text type="bold" size={Fonts.size.xvii}>
                Start Today's Route
              </Text>
              <Text
                size={Fonts.size.xv}
                textAlign="center"
                style={AppStyles.mTop10}>
                Starting a route will allow you to complete task(s) even in area
                without internet. Dispatcher won't be able to make any changes
                to your current route once route is started.You can end the
                route by going off-duty.
              </Text>
              <View style={{width: '100%', marginTop: 40}}>
                <AnimatedButton
                  loading={startRouteLoading}
                  text="Hold To Start Route"
                  onPress={() => startRouteSheetSubmit(true)}
                  buttonColors={[Colors.greenGradient, Colors.blueGradient]}
                />
              </View>
            </View>
          );
        }}
        renderHeader={renderHeader}
      />
      <BottomSheet
        ref={ref => routeEndBsRef(ref)}
        snapPoints={[0, 300]}
        initialSnap={0}
        enabledContentGestureInteraction={false}
        renderContent={() => {
          return (
            <View style={styles.btmParent}>
              <Text type="bold" size={Fonts.size.xvii}>
                End Today’s Route
              </Text>
              <Text
                size={Fonts.size.xv}
                textAlign="center"
                style={AppStyles.mTop10}>
                You can end route if you are done for today even if there are
                some unfinished task(s). Ending a route will allow dispatcher
                making changes to the route
              </Text>
              <View style={{width: '100%', marginTop: 40}}>
                <AnimatedButton
                  loading={startRouteLoading}
                  text="Hold To End Route"
                  onPress={() => startRouteSheetSubmit(false)}
                  buttonColors={[Colors.blueGradient, Colors.greenGradient]}
                />
              </View>
            </View>
          );
        }}
        renderHeader={renderHeader}
      />
      <Modal
        transparent
        visible={endRouteModalVisible}
        onRequestClose={() => {}}
        animationType={'slide'}>
        <View style={styles.modalCenterView}>
          <View style={styles.modalContentView}>
            {/* <View style={styles.closeButton}>
              <TouchableOpacity onPress={closeEndRouteModal}>
                <Image source={Images.cross} style={{height: 27, width: 27}} />
              </TouchableOpacity>
            </View> */}
            <Text type="bold" size={Fonts.size.xvii}>
              End Today’s Route
            </Text>
            <Text
              size={Fonts.size.xv}
              textAlign="center"
              style={AppStyles.mTop10}>
              You can end route if you are done for today even if there are some
              unfinished task(s). Ending a route will allow dispatcher making
              changes to the route
            </Text>
            <View style={{width: '100%', marginTop: 40}}>
              <AnimatedButton
                loading={startRouteLoading}
                text="Hold To End Route"
                onPress={() => startRouteSheetSubmit(false)}
                buttonColors={[Colors.blueGradient, Colors.greenGradient]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
