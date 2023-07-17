import {StyleSheet} from 'react-native';
import {Colors, AppStyles, Fonts} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGrey,
    paddingHorizontal: 16,
  },
  mapPortionParent: {alignItems: 'center', marginTop: 10},
  mapIcon: {height: 60, width: 60, resizeMode: 'contain'},

  mapIconWaze: {height: 55, width: 60, resizeMode: 'contain'},
  mapIconParentView: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },
  spacer: {width: 20},
  box: {
    flex: 1,
    borderColor: '#b4b3b3',
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    ...AppStyles.boxShadow,
  },
  copyAddress: {
    marginTop: 20,
    flex: 1,
    borderColor: Colors.white,
    borderWidth: 2,
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingLeft: 10,
    paddingRight: 3,
  },
  copyButton: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: Colors.white,
  },
  boxViewParent: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  locationDetails: {marginTop: 10},
  locationDetailsItem: {flexDirection: 'row'},

  lineHeight: {
    lineHeight: 20,
  },
});
