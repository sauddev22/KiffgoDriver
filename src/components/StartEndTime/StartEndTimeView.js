import React from 'react';
import {View, Image as RnImage} from 'react-native';
import {Text, Image, Button} from '../../components';
import styles from './StartEndTimeStyles';
import {Fonts, AppStyles, Metrics, Colors} from '../../theme';
import {timeLaps} from '../../constants';
import util from '../../util';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import moment from 'moment-timezone';

export default function StartEndTimeView(props) {
  const {
    title,
    timeUpdate,
    startIndexState,
    endIndexState,
    cancelCallback,
    donePress,
    dayLoading,
    dateInfo,
  } = props;
  console.log({startIndexState, endIndexState});
  const duration = moment(timeLaps[endIndexState], 'HH:mm').diff(
    moment(timeLaps[startIndexState], 'HH:mm'),
  );
  return (
    <View style={styles.container}>
      <Text size={Fonts.size.xxii} style={AppStyles.textAlignCenter}>
        {title}
      </Text>
      <Text size={Fonts.size.xxii} style={AppStyles.textAlignCenter}>
        {dateInfo}
      </Text>
      <View style={styles.timeShowParent}>
        <View style={styles.timeShowItem}>
          <Text style={styles.showTimeText}>{timeLaps[startIndexState]}</Text>
          <Text size={Fonts.size.x} color={Colors.lightGrey} type="bold">
            START TIME
          </Text>
        </View>
        <View style={styles.timeShowItem}>
          <Text style={styles.showTimeText}>{timeLaps[endIndexState]}</Text>
          <Text size={Fonts.size.x} color={Colors.lightGrey} type="bold">
            END TIME
          </Text>
        </View>
      </View>
      <View style={AppStyles.mTop10}>
        <Text size={Fonts.size.xiv} color={Colors.lightGrey}>
          Duration{' '}
          {util.getTimeInterval(
            timeLaps[startIndexState],
            timeLaps[endIndexState],
          )}
        </Text>
      </View>
      <View style={styles.timerParentContainer}>
        <View style={styles.timerParent}>
          <Text
            size={Fonts.size.xiv}
            style={AppStyles.mTop15}
            color={Colors.lightGrey}>
            Slide to adjust
          </Text>
          <MultiSlider
            values={[startIndexState, endIndexState]}
            step={1}
            max={timeLaps.length - 1}
            min={0}
            enabledTwo
            onValuesChange={value => timeUpdate(value)}
          />
        </View>
      </View>
      <View style={styles.buttonsParent}>
        <Button
          onPress={() => cancelCallback()}
          style={styles.button}
          color={Colors.text.primary}>
          Cancel
        </Button>
        <Button
          isLoading={dayLoading}
          onPress={() => donePress()}
          color={Colors.text.white}
          style={[
            styles.button,
            {backgroundColor: Colors.accent, marginLeft: 10},
          ]}>
          Done
        </Button>
      </View>
    </View>
  );
}
