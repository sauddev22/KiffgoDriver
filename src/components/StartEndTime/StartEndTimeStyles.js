import {StyleSheet} from 'react-native';
import {Colors, Metrics, Fonts} from '../../theme';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white', alignItems: 'center'},
  timerParentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  timerParent: {backgroundColor: 'white', alignItems: 'center', marginTop: 10},
  timer: {width: Metrics.screenWidth / 2},
  buttonsParent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    marginTop: 10,
    width: Metrics.screenWidth,
    paddingHorizontal: 80,
    paddingVertical: 10,
  },
  button: {height: 38, flex: 1},
  timeShowParent: {
    width: Metrics.screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 70,
    marginTop: 15,
  },
  timeShowItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.accentLight,
    borderRadius: Metrics.borderRadius,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  showTimeText: {
    textAlign: 'center',
    fontSize: Fonts.size.xxiv,
    color: Colors.lightGrey,
  },
});
