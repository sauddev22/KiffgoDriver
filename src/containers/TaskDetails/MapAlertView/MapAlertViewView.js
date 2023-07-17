import React from 'react';
import {
  View,
  Image as RnImage,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Text, Image, Button} from '../../../components';
import styles from './MapAlertViewStyles';
import {Fonts, Colors, Images, AppStyles} from '../../../theme';
import util from '../../../util';
import {duration} from 'moment';
import {MAP_TYPES, activeOpacity, TASK_FIELDS_NAME} from '../../../constants';
export default function MapAlertViewView(props) {
  const {task, onNavBtnPress, currentLocation} = props;
  const latitude = task[TASK_FIELDS_NAME.LOCATION_LATITUDE];
  const longitude = task[TASK_FIELDS_NAME.LOCATION_LONGITUDE];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* map icons view start */}
      <View style={styles.mapPortionParent}>
        <Text color={Colors.text.primary} size={Fonts.size.medium}>
          Choose your navigation app
        </Text>
        <View style={styles.mapIconParentView}>
          <TouchableOpacity
            onPress={() =>
              onNavBtnPress(MAP_TYPES.WAZE, currentLocation, {
                latitude,
                longitude,
              })
            }>
            <RnImage source={Images.waze_maps} style={styles.mapIconWaze} />
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity
            onPress={() =>
              onNavBtnPress(MAP_TYPES.GOOGLE, currentLocation, {
                latitude,
                longitude,
              })
            }>
            <RnImage source={Images.google_map_icon} style={styles.mapIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Details Start */}
      <View style={styles.locationDetails}>
        {/* Floor description */}
        <View style={styles.copyAddress}>
          <Text
            size={Fonts.size.xiv}
            color={Colors.text.white}
            style={AppStyles.flex}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {task[TASK_FIELDS_NAME.LOCATION_BUSINESS_NAME] +
              ' , ' +
              task[TASK_FIELDS_NAME.STREET_NUMBER] +
              ' , ' +
              task[TASK_FIELDS_NAME.STREET_NAME] +
              ' , ' +
              task[TASK_FIELDS_NAME.LOCATION_CITY] +
              ' , ' +
              task[TASK_FIELDS_NAME.LOCATION_POSTCODE] +
              ' , ' +
              task[TASK_FIELDS_NAME.COUNTRY_NAME]}
          </Text>
          <TouchableOpacity
            activeOpacity={activeOpacity.medium}
            style={styles.copyButton}
            onPress={() => props.writeToClipboard()}>
            <Text
              style={{fontFamily: Fonts.type.bold}}
              color={Colors.text.grey}>
              Copy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Location Details End */}
    </ScrollView>
  );
}
