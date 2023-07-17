import React from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Text, Image, CustomNavbar} from '../../../components';
import styles from './FailureReasonStyles';
import {AppStyles, Colors, Fonts} from '../../../theme';
import util from '../../../util';
import {activeOpacity, TASK_FIELDS_NAME} from '../../../constants';
import {Actions} from 'react-native-router-flux';
export default function FailureReasonView(props) {
  const {
    selectedIndex,
    reasons,
    setSelected,
    loading,
    myTask,
    onCancelPress,
    onSavePress,
  } = props;
  return (
    <View style={styles.container}>
      <CustomNavbar
        hasBorder={false}
        rightBtnText="Save"
        leftBtnText="Cancel"
        hasBack={false}
        leftBtnPress={onCancelPress}
        rightBtnPress={onSavePress}
      />
      <View style={AppStyles.basePadding}>
        <View>
          <Text type="bold" size={Fonts.size.xxiii}>
            What’s the failure reason ?
          </Text>
        </View>
        {loading && (
          <ActivityIndicator
            style={AppStyles.mTop25}
            size="large"
            color={Colors.accent}
          />
        )}
        <FlatList
          style={styles.listStyle}
          data={reasons}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            let selected =
              myTask[TASK_FIELDS_NAME.REASON] === item.failure_reason;
            return (
              <TouchableOpacity
                onPress={() => setSelected(item.failure_reason)}
                activeOpacity={activeOpacity.low}
                style={styles.itemParent}>
                <Text size={Fonts.size.xiv}>{item.failure_reason}</Text>
                <View style={styles.radio}>
                  {selected && <View style={styles.radioSelected} />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}
