import {StyleSheet} from 'react-native';
import {Colors, Metrics, Fonts} from '../../theme';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  mainContainer: {
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: 10,
  },
  infoArea: {
    width: '60%',
  },
  textView: {
    marginBottom: 6,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    color: Colors.accent,
  },

  titleIcon: {
    marginRight: 10,
  },

  boldText: {
    fontFamily: Fonts.type.extraBold,
  },
  circleView: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'red',
    marginRight: 7,
  },
  dotLabelView: {flexDirection: 'row', alignItems: 'center'},
  rowView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tickIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  crossIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  camSigParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  camParent: {
    height: 100,
    flex: 1,
    borderColor: Colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camSignLoadingParent: {
    height: 100,
    flex: 1,
    borderColor: Colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camStripVertical: {
    position: 'absolute',
    top: -2,
    height: 100,
    width: 50,
    backgroundColor: Colors.background.primary,
    zIndex: 10,
  },
  camStripHorizontal: {
    position: 'absolute',
    top: 20.5,
    height: 55,
    width: '105%',
    backgroundColor: Colors.background.primary,
  },
  sigParent: {
    height: 100,
    flex: 1,
    borderColor: Colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigStripVertical: {
    position: 'absolute',
    top: -2,
    height: 100,
    width: 50,
    backgroundColor: Colors.background.primary,
    zIndex: 10,
  },
  sigStripHorizontal: {
    position: 'absolute',
    top: 20.5,
    height: 55,
    width: '105%',
    backgroundColor: Colors.background.primary,
  },
  camIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  iconTextParent: {
    zIndex: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureImageParent: {
    height: 100,
    width: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigImage: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
  picImageParent: {
    height: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signLoadingParent: {
    backgroundColor: Colors.background.primary,
    height: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picImage: {
    height: 100,
    width: '100%',
    resizeMode: 'contain',
  },
  submitButton: {
    height: 50,
    width: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requiredLabel: {
    height: 22,
  },
  barcodeIcon: {
    height: 15,
    width: 15,
    marginRight: 10,
  },
});
