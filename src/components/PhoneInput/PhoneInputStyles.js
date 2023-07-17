import {StyleSheet} from 'react-native';
import {Colors} from '../../theme';

export default StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: 'white',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textInput: {
    fontFamily: 'Nunito-Regular',
    fontSize: 19,
    color: Colors.text.primary,
    width: '100%',
    paddingRight: 100,
    padding: 0,
  },
  code: {marginStart: 14},
  line: {
    marginHorizontal: 13,
    height: '90%',
    width: 2,
    backgroundColor: Colors.text.secondary,
  },
  tickIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  tickParent: {
    position: 'absolute',
    right: 14.5,
  },
});
