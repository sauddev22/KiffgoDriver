import {StyleSheet} from 'react-native';
import {Colors} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  doneBtn: {
    width: 56,
    height: 27,
    borderRadius: 13,
    backgroundColor: '#47b1ff',
    color: '#fff',
  },
  borderBottom: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 31,
    paddingBottom: 20,
    borderBottomColor: Colors.mercury,
    borderBottomWidth: 1,
  },
});
