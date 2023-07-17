// @flow
import {StyleSheet} from 'react-native';
import {Metrics} from '../../theme';

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Metrics.defaultUIHeight,
    borderRadius: Metrics.defaultUIHeight / 2,
    paddingHorizontal: 15,
  },
  spinner: {
    alignSelf: 'center',
  },
  touchableFeedback: {borderRadius: Metrics.defaultUIHeight / 2},
  opacity: {
    opacity: 0.5,
  },
  icon: {
    width: Metrics.icon.small,
    height: Metrics.icon.small,
    marginRight: 10,
  },
});
