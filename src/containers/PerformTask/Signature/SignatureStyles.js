import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  buttonView: {
    backgroundColor: Colors.darkGrey,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 40,
    width: 75,
  },
  greyButtons: {
    backgroundColor: Colors.grey,
  },
  whiteButtons: {
    backgroundColor: Colors.white,
  },
  buttonStyle: {
    transform: [{rotate: '90deg'}],
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 40,
    marginTop: 50,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
