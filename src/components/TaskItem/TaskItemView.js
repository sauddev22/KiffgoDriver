import React from 'react';
import {View, Image as RnImage, TouchableOpacity} from 'react-native';
import {Text, Image, ButtonView} from '../../components';
import styles from './TaskItemStyles';
import {AppStyles, Fonts, Colors, Images} from '../../theme';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  activeOpacity,
  TASK_STATUS,
  TASK_FIELDS_NAME,
  TIME_FORMAT1,
} from '../../constants';
import {Actions} from 'react-native-router-flux';
import util from '../../util';
import {getLocationText} from '../../Helper/taskHelper';
export default function TaskItemView(props) {
  const {item} = props;
  const data = item.item;

  let dotColor = '';
  let isAssignedTask = false;
  if (data[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.ASSIGNED) {
    dotColor = Colors.task.assigned;
    isAssignedTask = true;
  } else if (data[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.IN_TRANSIT) {
    dotColor = Colors.task.in_transit;
  } else if (data[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.SUCCESS) {
    dotColor = Colors.task.success;
  } else {
    dotColor = Colors.task.fail;
  }
  return (
    <ButtonView
      key={() => util.generateGuid()}
      onLongPress={isAssignedTask ? item.drag : console.log("don't move ")}
      delayLongPress={500}
      onPress={() =>
        props.completed
          ? Actions.taskDetailsCompleted({
              taskId: data[TASK_FIELDS_NAME.ID],
              uniquestring: data[TASK_FIELDS_NAME.TASK_NUMBER],
              completed: true,
            })
          : Actions.taskDetails({
              taskId: data[TASK_FIELDS_NAME.ID],
              uniquestring: data[TASK_FIELDS_NAME.TASK_NUMBER],
            })
      }
      activeOpacity={activeOpacity.low}
      style={
        data[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.IN_TRANSIT
          ? styles.containerSelected
          : styles.container
      }>
      {data[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.IN_TRANSIT && (
        <View style={styles.greenLine} />
      )}
      <View style={styles.indicatorsContainer}>
        <View style={[styles.dotView, {backgroundColor: dotColor}]} />
        <RnImage
          source={data[TASK_FIELDS_NAME.IS_DROPOFF] ? Images.drop : Images.pick}
          style={styles.pickDropIcon}
        />
      </View>

      <View style={[AppStyles.mLeft15, AppStyles.flex]}>
        <View style={[styles.rowStyle]}>
          <Text
            style={{flex: 1}}
            color={Colors.text.tertiary}
            size={Fonts.size.xvi}
            ellipsizeMode="tail"
            numberOfLines={1}
            type="bold">{`${getLocationText(data)}`}</Text>
        </View>

        <View style={styles.rowStyle}>
          <Text color={Colors.grey} size={Fonts.size.xvi}>
            {data[TASK_FIELDS_NAME.COMPLETE_AFTER] &&
              data[TASK_FIELDS_NAME.COMPLETE_BEFORE] && (
                <Text color={Colors.grey} size={Fonts.size.xvi}>
                  {util.timeWindowDateParser(
                    data[TASK_FIELDS_NAME.COMPLETE_AFTER] ||
                      data[TASK_FIELDS_NAME.CREATED_AT],
                  )}
                  {!_.isEmpty(data[TASK_FIELDS_NAME.COMPLETE_AFTER]) && (
                    <Text color={Colors.grey} size={Fonts.size.xvi}>
                      {` - `}
                      {util.timeWindowDateParser(
                        data[TASK_FIELDS_NAME.COMPLETE_BEFORE] ||
                          data[TASK_FIELDS_NAME.CREATED_AT],
                      )}
                    </Text>
                  )}
                </Text>
              )}
            {data[TASK_FIELDS_NAME.COMPLETE_AFTER] &&
              !data[TASK_FIELDS_NAME.COMPLETE_BEFORE] && (
                <Text color={Colors.grey} size={Fonts.size.xvi}>
                  {'After '}
                  {util.timeWindowDateParser(
                    data[TASK_FIELDS_NAME.COMPLETE_AFTER] ||
                      data[TASK_FIELDS_NAME.CREATED_AT],
                  )}
                </Text>
              )}
            {!data[TASK_FIELDS_NAME.COMPLETE_AFTER] &&
              data[TASK_FIELDS_NAME.COMPLETE_BEFORE] && (
                <Text color={Colors.grey} size={Fonts.size.xvi}>
                  {'Before '}
                  {util.timeWindowDateParser(
                    data[TASK_FIELDS_NAME.COMPLETE_BEFORE] ||
                      data[TASK_FIELDS_NAME.CREATED_AT],
                  )}
                </Text>
              )}
            {!data[TASK_FIELDS_NAME.COMPLETE_AFTER] &&
              !data[TASK_FIELDS_NAME.COMPLETE_BEFORE] && (
                <Text color={Colors.grey} size={Fonts.size.xvi}>
                  {'Anytime'}
                </Text>
              )}
          </Text>
        </View>

        <View style={[styles.rowStyle, {justifyContent: 'space-between'}]}>
          <Text color={Colors.grey} size={Fonts.size.xvi}>
            {`${data[TASK_FIELDS_NAME.RECIPIENT_NAME]}`}
            {__DEV__ && false && (
              <Text size={Fonts.size.x}>
                {' '}
                {data[TASK_FIELDS_NAME.SEQUENCE]}{' '}
              </Text>
            )}
            {__DEV__ && false && (
              <Text size={Fonts.size.x}>
                ^^{data[TASK_FIELDS_NAME.TASK_NUMBER]}{' '}
              </Text>
            )}
          </Text>
          <Text
            color={Colors.grey}
            size={Fonts.size.xiv}
            style={AppStyles.mRight10}>
            {util.dateParserThree(data[TASK_FIELDS_NAME.ETA])}
          </Text>
        </View>
      </View>
      <RnImage source={Images.rightArrow} style={styles.rightArrowIcon} />
    </ButtonView>
  );
}
