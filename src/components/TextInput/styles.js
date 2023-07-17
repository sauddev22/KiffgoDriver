// @flow
import {StyleSheet} from 'react-native';
import {Colors, Metrics, Fonts, AppStyles} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    paddingHorizontal: 8,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.xviii,
    color: Colors.text.white,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: 18 * 0.58,
    height: 18,
    ...AppStyles.mRight10,
  },
  multilineInput: {
    height: 120,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
  },
  showPass: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
});
