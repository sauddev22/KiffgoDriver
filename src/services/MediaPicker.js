// @flow
import ImagePickerNew from 'react-native-image-crop-picker';

import OpenSettings from 'react-native-open-settings';
import {Alert} from 'react-native';
import {IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT} from '../constants';

const LOG = __DEV__ && false;

class MediaPicker {
  pickImageFromCamera(cb, cropperCircleOverlay = false) {
    ImagePickerNew.openCamera({
      width: IMAGE_MAX_WIDTH,
      height: IMAGE_MAX_HEIGHT,
      cropping: true,
      cropperCircleOverlay,
      compressImageQuality: 0.7,
    }).then(
      image => {
        if (cb) {
          cb(image.path);
        }
        console.log({image});
      },
      error => {
        if (
          error.code === 'E_PERMISSION_MISSING' ||
          error.code === 'E_PICKER_NO_CAMERA_PERMISSION'
        ) {
          this.openSettingModal();
        }
      },
    );
  }

  pickImageFromGallery(cb, cropperCircleOverlay = false) {
    ImagePickerNew.openPicker({
      width: IMAGE_MAX_WIDTH,
      height: IMAGE_MAX_HEIGHT,
      cropping: true,
      cropperCircleOverlay,
    }).then(
      image => {
        if (cb) {
          cb(image.path);
        }
        console.log({image});
      },
      error => {
        if (error.code === 'E_PERMISSION_MISSING') {
          this.openSettingModal();
        }
      },
    );
  }

  openSettingModal() {
    Alert.alert(
      'Permission required',
      'Need permissions to access gallery and camera',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => OpenSettings.openSettings(),
        },
      ],
      {cancelable: false},
    );
  }
}

export default new MediaPicker();
