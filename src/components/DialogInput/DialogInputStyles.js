import {StyleSheet} from 'react-native';
import {Platform} from 'react-native';
import {Colors} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        backgroundColor: 'rgba(0,0,0,0.62)',
      },
    }),
  },
  modal_container: {
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    minWidth: 300,
    backgroundColor: Colors.darkGrey,
  },
  modal_body: {
    padding: 10,
  },
  title_modal: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,

    marginBottom: 5,
  },
  message_modal: {
    fontSize: 16,
    ...Platform.select({
      ios: {
        textAlign: 'center',
        marginBottom: 10,
      },
      android: {
        textAlign: 'left',
        marginTop: 20,
      },
    }),
  },
  input_container: {
    textAlign: 'left',
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    marginBottom: 15,
    marginTop: 10,
    ...Platform.select({
      ios: {paddingBottom: 5, paddingLeft: 5, paddingTop: 5},
      android: {paddingBottom: 5, paddingLeft: 5, paddingTop: 5},
    }),
  },
  btn_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#B0B0B0',
    maxHeight: 48,
  },
  divider_btn: {
    width: 1,
    backgroundColor: '#B0B0B0',
  },
  touch_modal: {
    flex: 1,
  },
  btn_modal_left: {
    fontSize: 18,
    color: Colors.accent,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#B0B0B0',
    padding: 10,
    height: 48,
    maxHeight: 48,
  },
  btn_modal_right: {
    color: Colors.accent,
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },
});
