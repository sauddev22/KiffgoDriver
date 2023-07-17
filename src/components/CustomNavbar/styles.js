// @flow
import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';

export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    backgroundColor: Colors.background.primary,
    paddingTop: Metrics.statusBarHeight,
    paddingHorizontal: Metrics.ratio(20),
    height: Metrics.navBarHeight,
    justifyContent: 'center',
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#D5D8DB',
  },
  btnImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  btnWrapper: {
    justifyContent: 'center',
    minWidth: 80,
  },
  rightBtn: {
    alignItems: 'flex-end',
  },
  searchHeader: {
    height: Metrics.navBarHeight + 50,
  },
});
