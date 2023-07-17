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
    borderRadius: 8,
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
  fieldIcon: {height: 20, width: 20, marginEnd: 10},
  title: {lineHeight: 25},
  line: {
    height: 0.5,
    flex: 1,
    backgroundColor: Colors.text.primary,
    marginTop: 14,
  },
  countryCode: {
    position: 'absolute',
    top: 0,
    left: 35,
    bottom: 0,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    borderRightColor: Colors.white,
    borderRightWidth: 1,
    paddingEnd: 10,
  },
  textStyle: {
    color: Colors.text.primary,
    fontSize: 17,
    fontFamily: 'Nunito-Regular',
    height: 25,
  },
});
