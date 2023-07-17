import React from 'react';
import {View, Image as RnImage, SafeAreaView} from 'react-native';
import {Text, Image} from '../../components';
import styles from './AlertStyles';
import {Fonts} from '../../theme';
export default function AlertView(props) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text type="italic" size={Fonts.size.xx}>
          Coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
