import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Alert, Vibration} from 'react-native';
import BarcodeScannerView from './BarcodeScannerView';
import {updateTask} from '../../actions/TaskActions';
import dataTypes from '../../dataTypes';
import moment from 'moment-timezone';
import util from '../../util';
import {TASK_FIELDS_NAME} from '../../constants';
import base64 from 'react-native-base64';
import RNBeep from 'react-native-a-beep';

class BarcodeScannerController extends React.Component {
  constructor() {
    super();
    this.state = {
      torchOn: false,
      manualEdit: false,
      pauseView: false,
      location: {},
      loading: true,
    };
    this.onBarCodeRead = _.throttle(this.onBarCodeRead, 2000, {
      trailing: false,
    });
  }
  static propTypes = {
    taskId: PropTypes.number.isRequired,
    task: PropTypes.object.isRequired,
  };
  static defaultProps = {};

  async componentDidMount() {
    // this.camRef.pausePreview();
    if (!this.state.location.latitude) {
      const location = await util.findCoordinates();
      if (location) {
        this.setState({
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          loading: false,
        });
      }
    }
  }
  /**
   *
   *@param {ScannedBarcode} e
   *@param {Boolean} pausePreview
   *@param {Boolean} isManual
   * @memberof BarcodeScannerController
   */
  onBarCodeRead = (e, pausePreview = false, isManual = false) => {
    console.log({ScannedBarcode: e});
    if (e.data) {
      const newTask = _.cloneDeep(this.props.task);
      !pausePreview && this.pauseView();
      /**
       * @type {Barcode[]}
       */
      const barList = newTask[TASK_FIELDS_NAME.BARCODES];
      /**
       * @type {Barcode[]}
       */
      const assignedList = barList.filter(item => item.isAssigned);
      /**
       * @type {Barcode[]}
       */
      const additionalList = barList.filter(item => !item.isAssigned);
      //check if scanned barcode is present in assigned list and has not been scanned
      const isInIndex = _.findIndex(
        assignedList,
        item =>
          _.isEqual(base64.decode(item.barcodeString), e.data) &&
          item.isCaptured === null,
      );
      if (isInIndex != -1) {
        //if scanned barcode is present in assigned list and not scanned yet
        const indexInMainList = _.findIndex(
          barList,
          item => item.innerId === assignedList[isInIndex].innerId,
        );
        //getting scanned barcode index from main barcode list
        if (indexInMainList != -1) {
          //double check for scanned barcode presence in main barcode list
          barList[indexInMainList].isCaptured = !isManual;
          barList[indexInMainList].capturedAt = moment().toISOString();
          barList[indexInMainList].location = this.state.location;
          //manipulating that item
        }
        !pausePreview && this.resumeScanning();
      } else {
        //scanned barcode is not present in the assigned list
        const additionalIndex = _.findIndex(additionalList, item =>
          _.isEqual(base64.decode(item.barcodeString), e.data),
        );
        //checking if scanned barcode is already present in the additional list
        if (additionalIndex === -1) {
          //if scanned barcode is not present in additional barcode list
          /**
           * @type {Barcode}
           */
          const barcode = this.createBarcode(e, isManual);
          //adding newly created barcode directly to the main barcode list
          newTask[TASK_FIELDS_NAME.BARCODES].push(barcode);
          !pausePreview && this.resumeScanning();
        } else {
          this.barcodeExistError();
        }
      }
      this.props.updateTask(newTask);
    } else {
    }
  };
  /**
   * @description pauseView function used when barcode is scanned to pause camera preview , vibrate and beep
   * @memberof BarcodeScannerController
   */
  pauseView = () => {
    this.camRef.pausePreview();
    this.setState({pauseView: true});
    Vibration.vibrate();
    RNBeep.beep();
  };
  /**
   * @description resumeScanning is used when a barcode is added to the list and system is ready to capture new barcode
   * @memberof BarcodeScannerController
   */
  resumeScanning = () => {
    setTimeout(() => {
      this.camRef.resumePreview();
      this.setState({pauseView: false});
    }, 500);
  };
  /**
   * @description barcodeExistError is called when barcode is present in both lists and can not added ant more. it shows red toast
   * @memberof BarcodeScannerController
   */
  barcodeExistError = () => {
    this.tostRef.show('Barcode already exist', 500);
    this.resumeScanning();
  };

  /**
   * @description used to create and return a new barcode object
   * @param {ScannedBarcode} data
   * @param {Boolean} isManual
   * @returns {Barcode} barcode
   * @memberof BarcodeScannerController
   */
  createBarcode = (data, isManual) => {
    /**
     * @type {Barcode}
     */
    const barcode = {};
    //new barcode item
    barcode.innerId = util.generateGuid();
    barcode.barcodeString = base64.encode(data.data);
    barcode.capturedAt = moment().toISOString();
    barcode.isAssigned = false;
    barcode.isCaptured = !isManual;
    barcode.isRequired = false;
    barcode.location = this.state.location;

    return barcode;
  };
  handleTorch = value => {
    if (value === true) {
      this.setState({torchOn: false});
    } else {
      this.setState({torchOn: true});
    }
  };
  showHideManualEdit = () => {
    this.setState(prevState => ({manualEdit: !prevState.manualEdit}));
  };
  /**
   * @description get code from user and calls update task function
   * @param {String} code
   */
  onSave = code => {
    if (!_.isEmpty(code)) {
      this.setState(prevState => ({manualEdit: !prevState.manualEdit}));
      this.onBarCodeRead({data: code}, true, true);
    }
  };
  render() {
    const {manualEdit, torchOn, pauseView, loading} = this.state;
    return (
      <BarcodeScannerView
        {...this.props}
        onBarCodeRead={this.onBarCodeRead}
        camRef={cam => (this.camRef = cam)}
        handleTorch={this.handleTorch}
        showHideManualEdit={this.showHideManualEdit}
        torchOn={torchOn}
        manualEdit={manualEdit}
        onSave={this.onSave}
        pauseView={pauseView}
        loading={loading}
        tostRef={ref => {
          this.tostRef = ref;
        }}
      />
    );
  }
}
const mapStateToProps = ({task}, props) => {
  task = _.find(task.tasks, {id: props.taskId});
  return {task};
};
const actions = {updateTask};
export default connect(
  mapStateToProps,
  actions,
)(BarcodeScannerController);
