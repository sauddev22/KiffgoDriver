import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './BottomSheetHeaderStyles';
import {Colors, AppStyles, Fonts} from '../../theme';
import {Text, Button} from '../../components';

export default function BottomSheetHeaderView(props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          AppStyles.flexRow,
          AppStyles.spaceBetween,
          AppStyles.alignItemsCenter,
          styles.borderBottom,
        ]}>
        <View>
          <Text size={Fonts.size.xxxii} color={Colors.scorpion}>
            Order 261401
          </Text>
          <Text size={Fonts.size.xx} type="bold">
            John Smith
          </Text>
        </View>
        <View>
          <Button
            size={Fonts.size.xxxii}
            style={styles.doneBtn}
            color={Colors.white}
            type="bold">
            Done
          </Button>
        </View>
      </View>
    </View>
  );
}
