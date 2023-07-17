import {StyleSheet} from 'react-native';
import {Colors, Metrics, AppStyles} from '../../theme';

export default StyleSheet.create({
  container: {
    height: Metrics.navBarHeight,
    backgroundColor: Colors.background.primary,
  },
  blackContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    ...AppStyles.flexRow,
    ...AppStyles.spaceAround,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  itemWrapper: {
    alignItems: 'center',
  },
  btn1: {
    marginTop: 10,
    width: 50,
    height: 30,
    ...AppStyles.centerInner,
  },
  line: {
    height: 2,
    width: 40,
    backgroundColor: Colors.accent,
  },
});
