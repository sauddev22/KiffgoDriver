import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  skipParent: {
    flexDirection: 'row',
    bottom: 57.5,
    width: Metrics.screenWidth,
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 34,
  },
});
