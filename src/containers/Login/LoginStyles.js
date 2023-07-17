import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';

export default StyleSheet.create({
  container: {flexGrow: 1},
  headerImage: {
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: Metrics.ratio(25),
    paddingTop: Metrics.statusBarHeight,
    flex: 1,
  },
  fab: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    backgroundColor: Colors.fab,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  buttonParent: {
    marginTop: 15,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'flex-end',
    marginRight: 15,
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
  forgotText: {
    alignSelf: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  termServiceText: {
    alignSelf: 'center',
    marginTop: 13,
    textAlign: 'center',
  },
  betaImage: {
    position: 'absolute',
    zIndex: 100,
    height: 100,
    width: 100,
    resizeMode: 'contain',
    top: Metrics.statusBarHeight,
  },
});
