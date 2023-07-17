import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  content: {
    paddingHorizontal: Metrics.ratio(20),
    paddingTop: 20,
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
    bottom: 20,
    right: 20,
  },
  resendParent: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  errorParent: {
    marginTop: 10,
  },
});
