import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingTop: Metrics.statusBarHeight,
  },
  profilePicParent: {
    marginTop: 25,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 111,
    width: 111,
    alignSelf: 'center',
  },
  camIconParent: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44 / 2,
    height: 34,
    width: 34,
    zIndex: 100,
    borderColor: 'white',
  },
  camIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  circularPlaceHolder: {
    zIndex: -10,
    position: 'absolute',
  },
  contentRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  vehicleRapper: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  vehicleIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  lineGreen: {
    position: 'absolute',
    backgroundColor: Colors.accent,
    height: 2,
    width: '70%',
    alignSelf: 'center',
    bottom: -12,
  },
  iconContainer: {},
  appVersion: {
    marginTop: 60,
    alignSelf: 'center',
  },
  logout: {
    marginTop: 5,
    marginBottom: 15,
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
  },
});
