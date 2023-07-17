import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';

export default StyleSheet.create({
  container: {flexGrow: 1},
  headerImage: {
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: Metrics.ratio(25),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  circleButtonParent: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    height: 25,
    width: 27,
  },
});
