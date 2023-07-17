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
    paddingBottom: 60,
    flex: 1,
  },
  dataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',

    marginTop: 25,
  },
  infoArea: {
    width: '60%',
  },
  textView: {
    marginBottom: 10,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonArea: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonParent: {
    marginTop: 15,
    height: 45,
    width: 45,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  button: {
    height: 45,
    width: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    height: 50,
    width: 50,
    marginTop: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey,
  },
  arrowIcon: {
    height: 22,
    width: 22,
  },
  locationIcon: {
    height: 28,
    width: 28,
  },
  longPressButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
  },
  longPressButtonLinear: {
    height: 50,
    width: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    color: Colors.accent,
  },

  titleIcon: {
    marginRight: 10,
    height: 14,
    width: 14,
    resizeMode: 'contain',
  },

  boldText: {
    fontFamily: Fonts.type.extraBold,
  },
  bottomSheetContainer: {
    overflow: 'visible',
    paddingTop: 10,
    borderRadius: 9,
    backgroundColor: Colors.darkGrey,
  },
  pickDropIcon: {
    marginLeft: 10,
  },
  timeLineItemParent: {
    flexDirection: 'row',
  },
  circleView: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.accent,
    marginTop: 3,
  },
  lineView: {
    position: 'absolute',
    backgroundColor: Colors.accent,
    width: 1,
    height: '100%',
    left: 5,
    top: 5,
  },
  timelineImage: {
    height: 75,
    width: 75,
  },
  timelineSignatureParent: {
    backgroundColor: Colors.white,
    marginTop: 5,
    height: 75,
    width: 195,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  signatureImage: {
    height: 100,
    width: 195,
  },
  modalCenterView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.windowTint,
  },
  modalContentView: {
    margin: 20,
    backgroundColor: Colors.bottomSheetColor,
    borderRadius: 20,
    padding: 35,
    width: Metrics.screenWidth - 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: -5,
    top: -5,
  },
});
