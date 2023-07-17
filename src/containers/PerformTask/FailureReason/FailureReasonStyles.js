import {StyleSheet} from 'react-native';
import {Colors} from '../../../theme';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background.primary},
  itemParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 7,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 11,
    borderColor: Colors.white,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    height: 15,
    width: 15,
    borderRadius: 11,
    backgroundColor: Colors.accent,
  },
  listStyle: {height: '100%', marginTop: 25},
});
