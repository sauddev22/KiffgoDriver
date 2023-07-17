import React from 'react';
import PropTypes from 'prop-types';
import PerformTaskView from './PerformTaskView';
import _ from 'lodash';
import {connect} from 'react-redux';
import BottomSheet from 'react-native-bottomsheet';
import {Actions} from 'react-native-router-flux';
import ImageRotate from 'react-native-image-rotate';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {
  IMAGE_MAX_WIDTH,
  IMAGE_MAX_HEIGHT,
  TASK_FIELDS_NAME,
  TASK_PROOFS,
  DATE_FORMAT1,
  DATE_TIME_FORMAT1,
  USER_FIELDS_NAME,
  INTERNET_ERROR,
} from '../../constants';
import {uploadSingleImage} from '../../actions/GeneralActions';
import {updateTask, completeTaskRequest} from '../../actions/TaskActions';
import ImagePicker from 'react-native-image-crop-picker';
import {Alert, Platform} from 'react-native';
import OpenSettings from 'react-native-open-settings';
import util from '../../util';
import moment from 'moment-timezone';
import {
  stopTracking,
  startTaskTracking,
  startTracking,
} from '../../Helper/trackingHelper';
import dataType from '../../dataTypes';
import {writeLog} from '../../Helper/loggerHelper';

class PerformTaskController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSuccess: true,
      imageUploading: false,
      signatureUploading: false,
      notes: props.task[TASK_FIELDS_NAME.DRIVER_NOTES],
      loading: false,
      imageError: false,
      signatureError: false,
      notesError: false,
      barcodesError: false,
      isKeyboardOpen: false,
      imageBase64: '',
    };
  }
  static propTypes = {
    taskId: PropTypes.number.isRequired,
    task: PropTypes.object.isRequired,
  };
  static defaultProps = {};
  switchTaskSuccess = status => {
    const newTask = _.cloneDeep(this.props.task);
    newTask[TASK_FIELDS_NAME.IS_SUCCESS] = status;
    newTask[TASK_FIELDS_NAME.REASON] = '';
    this.props.updateTask(newTask);
  };

  onSignaturePress = () => {
    if (
      !this.props.userData[USER_FIELDS_NAME.BUSINESS].offline_mode &&
      !this.props.networkStatus
    ) {
      util.topAlert(INTERNET_ERROR);
    } else if (_.isEmpty(this.props.task[TASK_FIELDS_NAME.SIGNATURE])) {
      if (!this.state.signatureUploading) {
        Actions.signature({
          taskId: this.props.task[TASK_FIELDS_NAME.ID],
          onDone: this._processSignature,
        });
      }
    } else {
      BottomSheet.showBottomSheetWithOptions(
        {
          options: ['Change', 'Remove', 'Cancel'],
          title: 'Upload Signature',
          dark: true,
          cancelButtonIndex: 2,
        },
        value => {
          if (value === 0) {
            Actions.signature({
              taskId: this.props.task[TASK_FIELDS_NAME.ID],
              onDone: this._processSignature,
            });
          }
          if (value === 1) {
            const newTask = _.cloneDeep(this.props.task);
            newTask[TASK_FIELDS_NAME.SIGNATURE] = {};
            newTask[TASK_FIELDS_NAME.SIGNATURE_TIME] = '';
            this.props.updateTask(newTask);
          }
        },
      );
    }
  };
  canUploadMore = () => {
    let {task} = this.props;
    if (task[TASK_FIELDS_NAME.PICTURE]) {
      if (task[TASK_FIELDS_NAME.PICTURE].length <= 9) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  onImagePress = () => {
    const imageSize = this.props.task[TASK_FIELDS_NAME.PICTURE].length;

    if (
      !this.props.userData[USER_FIELDS_NAME.BUSINESS].offline_mode &&
      !this.props.networkStatus
    ) {
      util.topAlert(INTERNET_ERROR);
    } else if (!this.state.imageUploading) {
      BottomSheet.showBottomSheetWithOptions(
        {
          options:
            imageSize > 0
              ? ['Take photo', 'Choose photo', 'Remove all photos', 'Cancel']
              : ['Take photo', 'Choose photo', 'Cancel'],
          title: 'Upload Image',
          dark: true,
          cancelButtonIndex: imageSize > 0 ? 3 : 2,
        },
        value => {
          if (value === 0) {
            if (this.canUploadMore()) {
              ImagePicker.openCamera({
                width: IMAGE_MAX_WIDTH,
                height: IMAGE_MAX_HEIGHT,
                cropping: true,
                useFrontCamera: false,
                compressImageQuality: 0.7,
              })
                .then(this.processImageCaptureSelect)
                .catch(e => {
                  if (
                    (e.code && e.code === 'E_PERMISSION_MISSING') ||
                    e.code === 'E_PICKER_NO_CAMERA_PERMISSION'
                  ) {
                    writeLog(e, 'from performTaskController from line 139');
                    Alert.alert(
                      'Permission Required',
                      'Please allow this app to use your camera.',
                      [
                        {
                          text: 'Open Settings',
                          onPress: () => {
                            OpenSettings.openSettings();
                          },
                        },
                        {
                          text: 'Cancle',
                          onPress: () => {},
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  } else if (
                    e.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR'
                  ) {
                    Alert.alert('Error', 'No camera on simulator');
                  }
                  console.log({e});
                });
            } else {
              util.topAlert('Full cannot add more than 10 pics');
              writeLog(
                'Full cannot add more than 10 pics',
                'from performTaskController from line 167',
              );
            }
          }
          if (value === 1) {
            if (this.canUploadMore()) {
              ImagePicker.openPicker({
                width: IMAGE_MAX_WIDTH,
                height: IMAGE_MAX_HEIGHT,
                cropping: true,
                compressImageQuality: 0.7,
              })
                .then(this.processImageCaptureSelect)
                .catch(e => {
                  if (e.code && e.code === 'E_PERMISSION_MISSING') {
                    writeLog(e, 'from performTaskController from line 186');
                    Alert.alert(
                      'Permission Required',
                      'Cannot access images. Please allow access if you want to be able to select images.',
                      [
                        {
                          text: 'Open Settings',
                          onPress: () => {
                            OpenSettings.openSettings();
                          },
                        },
                        {
                          text: 'Cancle',
                          onPress: () => {},
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  }
                  console.log({e});
                });
            } else {
              util.topAlert('Full cannot add more than 10 pics');
            }
          }
          if (value === 2) {
            this.removeAllImages();
          }
        },
      );
    }
  };

  processImageCaptureSelect = image => {
    if (
      this.props.userData[USER_FIELDS_NAME.BUSINESS].offline_mode &&
      !this.props.networkStatus
    ) {
      image.isLocal = true;
      const newTask = _.cloneDeep(this.props.task);
      newTask[TASK_FIELDS_NAME.PICTURE].push(image);
      newTask[TASK_FIELDS_NAME.PICTURE_TIME] = moment().toISOString();
      this.props.updateTask(newTask);
    } else {
      this._uploadImage(image);
    }
  };

  onBarcodeCapturePress = () => {
    /**
     * @type {Barcode[]}
     */
    const capturedList = this.props.task[TASK_FIELDS_NAME.BARCODES].filter(
      item => item.capturedAt != null,
    );
    if (capturedList.length > 0) {
      BottomSheet.showBottomSheetWithOptions(
        {
          options: ['Scan New Barcode', 'Remove All Barcodes', 'Cancel'],
          title: 'Capture Barcode',
          dark: true,
          cancelButtonIndex: 0,
        },
        value => {
          if (value === 0) {
            Actions.barcodeScanner({
              taskId: this.props.task[TASK_FIELDS_NAME.ID],
            });
          }
          if (value === 1) {
            const newTask = _.cloneDeep(this.props.task);
            newTask[TASK_FIELDS_NAME.BARCODES] = this.props.task[
              TASK_FIELDS_NAME.BARCODES_BACKUP
            ];
            this.props.updateTask(newTask);
          }
          if (value === 2) {
          }
        },
      );
    } else {
      Actions.barcodeScanner({
        taskId: this.props.task[TASK_FIELDS_NAME.ID],
      });
    }
  };
  /**
   *
   * @param {Barcode} item
   */
  onBarcodeItemPress = item => {
    BottomSheet.showBottomSheetWithOptions(
      {
        options: ['Remove', 'Cancel'],
        title: 'Remove selected barcode ?',
        dark: true,
        cancelButtonIndex: 0,
      },
      value => {
        if (value === 0) {
          const newTask = _.cloneDeep(this.props.task);
          const selectedCodeIndex = _.findIndex(newTask.barcodes, {
            innerId: item.innerId,
          });
          if (selectedCodeIndex != -1) {
            newTask[TASK_FIELDS_NAME.BARCODES].splice(selectedCodeIndex, 1);
          }
          this.props.updateTask(newTask);
        }
      },
    );
  };
  _keyboardOpen = () => {
    this.setState({isKeyboardOpen: true});
  };
  _keyboardClose = () => {
    this.setState({isKeyboardOpen: false});
  };
  removeAllImages = () => {
    const newTask = _.cloneDeep(this.props.task);
    newTask[TASK_FIELDS_NAME.PICTURE] = [];
    newTask[TASK_FIELDS_NAME.PICTURE_TIME] = '';
    this.props.updateTask(newTask);
  };
  _uploadImage = image => {
    this.setState({imageUploading: true});
    const imagePath = image.path;
    const imageFormData = new FormData();
    const photo = {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'taskPicture.jpg',
    };
    imageFormData.append('tags', 'mobile_upload'); // Optional - add tag for image admin in Cloudinary
    imageFormData.append('upload_preset', 'gxwgoos3');
    imageFormData.append('file', photo);
    this.props.uploadSingleImage(imageFormData, (status, newImage = {}) => {
      console.log({statusImageUpload: status});
      if (status) {
        const image = {
          public_id: newImage.public_id,
          version: newImage.version,
          height: newImage.height,
          width: newImage.width,
          format: newImage.format,
          bytes: newImage.bytes,
          url: newImage.url,
          secure_url: newImage.secure_url,
          isLocal: false,
        };
        const newTask = _.cloneDeep(this.props.task);
        newTask[TASK_FIELDS_NAME.PICTURE].push(image);
        newTask[TASK_FIELDS_NAME.PICTURE_TIME] = moment().toISOString();
        this.props.updateTask(newTask);
        this.setState({imageUploading: false});
      }
    });
  };
  _processSignature = async result => {
    if (
      this.props.userData[USER_FIELDS_NAME.BUSINESS].offline_mode &&
      !this.props.networkStatus
    ) {
      const imagePath = result;
      const {task} = this.props;
      let uri = Platform.OS === 'android' ? 'file://' + imagePath : result;
      let imageObject = await this.rotateImage(uri);
      imageObject.isLocal = true;
      let newTask = _.cloneDeep(task);
      newTask[TASK_FIELDS_NAME.SIGNATURE] = imageObject;
      newTask.signature_time = moment().toISOString();
      this.props.updateTask(newTask);
    } else {
      this._signatureUpload(result);
    }
  };
  _signatureUpload = async result => {
    this.setState({signatureUploading: true});
    const {task} = this.props;
    // Object.preventExtensions(task);
    const imagePath = result;
    const imageFormData = new FormData();
    let uri = Platform.OS === 'android' ? 'file://' + imagePath : imagePath;
    let imageObject = await this.rotateImage(uri);
    let base64Uri = 'data:image/jpg;base64,' + imageObject.base64;
    imageFormData.append('tags', 'mobile_upload'); // Optional - add tag for image admin in Cloudinary
    imageFormData.append('upload_preset', 'gxwgoos3');
    imageFormData.append('file', base64Uri);
    this.props.uploadSingleImage(imageFormData, (status, newImage = {}) => {
      console.log({status: status});
      if (status) {
        const image = {
          public_id: newImage.public_id,
          version: newImage.version,
          height: newImage.height,
          width: newImage.width,
          format: newImage.format,
          bytes: newImage.bytes,
          url: newImage.url,
          secure_url: newImage.secure_url,
          isLocal: false,
        };
        let newTask = _.cloneDeep(task);
        newTask[TASK_FIELDS_NAME.SIGNATURE] = image;
        newTask.signature_time = moment().toISOString();
        this.props.updateTask(newTask);
        this.setState({signatureUploading: false});
      }
    });
  };
  rotateImage = async image => {
    let height = 160;
    let width = 150;
    return new Promise((resolve, reject) => {
      ImageRotate.rotateImage(
        image,
        270,
        uri => {
          // resolve('hello');

          if (Platform.OS === 'android') {
            console.log('rotate', uri);
            RNFetchBlob.fs
              .readFile(uri, 'base64')
              .then(data => {
                const object = {};
                object.base64 = data;
                object.width = width;
                object.height = height;
                object.uri = uri;
                resolve(object);
              })
              .catch(err => {
                reject(err);
                writeLog(err, 'from performTaskController from line 398');
              });
          } else {
            console.log(uri);
            const outputPath = `${RNFetchBlob.fs.dirs.DocumentDir}`;
            ImageResizer.createResizedImage(
              uri,
              height,
              width,
              'JPEG',
              100,
              0,
              outputPath,
            )
              .then(response => {
                console.log(response.uri, response.size);
                let imageUri = response.uri;
                if (Platform.OS === 'ios') {
                  imageUri = imageUri.split('file://')[1];
                }
                RNFetchBlob.fs
                  .readFile(imageUri, 'base64')
                  .then(resData => {
                    const object = {};
                    object.base64 = resData;
                    object.width = height;
                    object.height = width;
                    object.uri = response.uri;

                    resolve(object);
                  })
                  .catch(err => {
                    writeLog(err, 'from performTaskController from line 431');
                    reject(err);
                  });
              })
              .catch(err => {
                writeLog(err, 'from performTaskController from line 436');
                reject(err);
              });
          }
        },
        err => {
          writeLog(err, 'from performTaskController from line 442');
          reject(err);
        },
      );
    });
  };
  onChangeNotes = note => {
    this.setState({notes: note});
  };
  _validate = () => {
    const {task} = this.props;
    /**
     * @type {Barcode[]}
     */
    const barcodes = task[TASK_FIELDS_NAME.BARCODES];
    const notCap = barcodes.filter(
      item => item.isRequired && item.isCaptured === null,
    );
    const {proof, is_success} = task;
    let imageError = false;
    let signatureError = false;
    let notesError = false;
    let barcodesError = false;
    if (proof.indexOf(TASK_PROOFS.PICTURE) > -1) {
      if (task[TASK_FIELDS_NAME.PICTURE].length < 1) {
        imageError = true;
      }
    }
    if (is_success) {
      if (proof.indexOf(TASK_PROOFS.SIGNATURE) > -1) {
        if (_.isEmpty(task[TASK_FIELDS_NAME.SIGNATURE])) {
          signatureError = true;
        }
      }
      if (notCap.length > 0) {
        barcodesError = true;
      }
    }

    if (proof.indexOf(TASK_PROOFS.NOTES) > -1) {
      if (_.isEmpty(this.state.notes) || util.onlySpaces(this.state.notes)) {
        notesError = true;
      }
    }

    if (imageError || signatureError || notesError || barcodesError) {
      this.setState({imageError, signatureError, notesError, barcodesError});
      return false;
    } else {
      return true;
    }
  };
  onSubmitPress = () => {
    const {task} = this.props;
    const newTask = _.cloneDeep(task);
    newTask[TASK_FIELDS_NAME.DRIVER_NOTES] = this.state.notes;
    this.props.updateTask(newTask);
    if (this._validate()) {
      if (
        this.props.userData[USER_FIELDS_NAME.BUSINESS].offline_mode &&
        !this.props.networkStatus
      ) {
        const payload = {};
        payload.task = task[TASK_FIELDS_NAME.TASK_NUMBER];
        payload.isOffline = true;
        payload.note = this.state.notes;

        this.setState({loading: true}, () => {
          setTimeout(() => {
            util.hideLoader(this);
            Actions.reset('taskLists');
          }, 1000);
          setTimeout(() => {
            this.props.completeTaskRequest(payload, () => {});
          }, 2000);
        });
      } else {
        this.completeTaskOnline();
      }
    }
  };

  completeTaskOnline = () => {
    const {task} = this.props;
    const payload = {};
    payload.task = task[TASK_FIELDS_NAME.TASK_NUMBER];
    payload.barcodes = task[TASK_FIELDS_NAME.BARCODES];
    payload.is_success = task[TASK_FIELDS_NAME.IS_SUCCESS];
    payload.picture = task[TASK_FIELDS_NAME.PICTURE];
    payload.picture_time = task[TASK_FIELDS_NAME.PICTURE_TIME];
    payload.signature = task[TASK_FIELDS_NAME.SIGNATURE];
    payload.signature_time = task.signature_time;
    payload.reason = task[TASK_FIELDS_NAME.REASON];
    payload.note = this.state.notes;
    payload.receiver_name = '';
    payload.distanceMiles = 0;
    console.log('COMPLETE TASK DATA');
    console.log(JSON.stringify(payload));
    util.showLoader(this);
    this.props.completeTaskRequest(payload, status => {
      util.hideLoader(this);
      if (status) {
        util.taskEmit();
        Actions.reset('taskLists');
        stopTracking();
        setTimeout(() => {
          startTracking();
        }, 2000);
      }
    });
  };
  render() {
    const {
      imageError,
      signatureError,
      notesError,
      notes,
      loading,
      isSuccess,
      imageUploading,
      isKeyboardOpen,
      signatureUploading,
      imageUri,
      barcodesError,
    } = this.state;
    return (
      <PerformTaskView
        {...this.props}
        imageError={imageError}
        signatureError={signatureError}
        notesError={notesError}
        barcodesError={barcodesError}
        notes={notes}
        loading={loading}
        isSuccess={isSuccess}
        imageUploading={imageUploading}
        signatureUploading={signatureUploading}
        isKeyboardOpen={isKeyboardOpen}
        onChangeNotes={this.onChangeNotes}
        switchTaskSuccess={this.switchTaskSuccess}
        onSignaturePress={this.onSignaturePress}
        onImagePress={this.onImagePress}
        onSubmitPress={this.onSubmitPress}
        keyboardClose={this._keyboardClose}
        keyboardOpen={this._keyboardOpen}
        onBarcodeCapturePress={this.onBarcodeCapturePress}
        onBarcodeItemPress={this.onBarcodeItemPress}
        imageUri={imageUri}
      />
    );
  }
}
const mapStateToProps = ({task, general, user}, props) => {
  task = _.find(task.tasks, {id: props.taskId});

  return {task, networkStatus: general.networkStatus, userData: user.data};
};
const actions = {updateTask, uploadSingleImage, completeTaskRequest};
export default connect(
  mapStateToProps,
  actions,
)(PerformTaskController);
