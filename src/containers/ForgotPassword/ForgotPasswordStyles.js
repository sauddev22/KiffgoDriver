import {StyleSheet} from 'react-native';
import {Colors} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    padding: 20,
    paddingTop: 40,
  },
  backIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headingText: {
    alignSelf: 'center',
  },
  buttonParent: {
    marginTop: 15,
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
