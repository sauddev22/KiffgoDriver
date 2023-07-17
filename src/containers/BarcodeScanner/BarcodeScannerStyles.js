import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    position: 'relative',
  },
  headerContainer: {
    position: 'absolute',
  },
  header: {
    height: 40,
    width: Metrics.screenWidth,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40,
  },
  bottomOverlay: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 20,
    paddingRight: 20,
  },
  box: {
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 11,
    height: 185,
    width: Metrics.screenWidth - 30,
  },
  redBorder: {
    borderColor: Colors.accent,
  },
  dialogContainer: {
    backgroundColor: Colors.darkGrey,
  },
  customInput: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.background.primary,
    color: Colors.text.primary,
  },
  btmParent: {
    backgroundColor: Colors.bottomSheetColor,
    height: 500,
    padding: 10,
    paddingBottom: 20,
  },

  toast: {
    backgroundColor: Colors.bitterSweet,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  toastText: {color: 'white', fontSize: 16},
  barcodeIcon: {
    height: 15,
    width: 15,
    marginRight: 10,
  },
  barcodeParent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
  requiredIcon: {
    height: 12,
    width: 12,
    marginLeft: 10,
  },
  loader: {position: 'absolute', top: 0, bottom: 0, right: 0, left: 0},
  headerWrapper: {
    backgroundColor: Colors.bottomSheetColor,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    top: 1,
  },
  sheetDraggingBtn: {
    height: 5,
    width: 40,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  kiffgoText: {
    position: 'absolute',
    bottom: 4,
    right: 8,
  },
});
