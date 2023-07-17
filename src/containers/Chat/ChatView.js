import React from 'react';
import {View, Image as RnImage, SafeAreaView} from 'react-native';
import {Text, Image} from '../../components';
import styles from './ChatStyles';
import {Fonts} from '../../theme';
export default function ChatView(props) {
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
