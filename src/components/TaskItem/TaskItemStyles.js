import {StyleSheet} from 'react-native';
import {Colors} from '../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#242424',
    borderRadius: 12,
    marginTop: 10,
  },
  containerSelected: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginTop: 10,
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  indicatorsContainer: {
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 6,
    marginLeft: 5,
  },
  dotView: {
    height: 13,
    width: 13,
    borderRadius: 7,
    backgroundColor: 'yellow',
  },
  pickDropIcon: {
    height: 20,
    width: 15,
    resizeMode: 'contain',
  },
  greenLine: {
    backgroundColor: Colors.accent,
    height: 3,
    position: 'absolute',
    bottom: -3,
    right: 0,
    left: 0,
    marginHorizontal: 20,
  },
  rightArrowIcon: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
});
