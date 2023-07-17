import React from 'react';
import {
  View,
  Image as RnImage,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Text, Image, CustomNavbar, TaskItem} from '../../components';
import {Colors} from '../../theme';
import util from '../../util';
import styles from './TaskHistoryStyles';
function renderItem(item) {
  return <TaskItem item={item} completed={true} />;
}
export default function TaskHistoryView(props) {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.background.primary}
        barStyle="light-content"
        translucent={true}
      />
      <CustomNavbar
        hasBorder={false}
        hasBack
        whiteBack
        title={`Past 7 Days`}
        titleColor={Colors.text.white}
        rightBtnText={'Close'}
        rightBtnPress={() => Actions.pop()}
      />
      <FlatList
        contentContainerStyle={styles.flatListContentContainer}
        data={props.taskList}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshing={true}
        refreshControl={
          <RefreshControl
            refreshing={props.loading}
            onRefresh={props.getData}
            tintColor={Colors.accent}
          />
        }
        keyExtractor={item => {
          util.keyExtractor(item.id);
        }}
      />
    </View>
  );
}
