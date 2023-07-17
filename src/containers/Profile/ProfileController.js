import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  userLogoutRequest,
  uploadImageRequest,
  userUpdateProfileRequest,
} from '../../actions/UserActions';
import {setSelectedTab} from '../../actions/GeneralActions';
import ProfileView from './ProfileView';
import {Actions} from 'react-native-router-flux';
import {Alert} from 'react-native';
import OpenSettings from 'react-native-open-settings';
import ImagePicker from 'react-native-image-crop-picker';
import {IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT} from '../../constants';
import util from '../../util';
import BottomSheet from 'react-native-bottomsheet';
import {stopTracking} from '../../Helper/trackingHelper';
import {clearAllNotifications} from '../../services/firebaseHelper';
import {writeLog} from '../../Helper/loggerHelper';

class ProfileController extends React.Component {
  constructor() {
    super();
    this.state = {loading: false};
    ProfileController.instance = this;
  }
  static onExit() {
    if (ProfileController.instance) {
      ProfileController.instance._onExit();
    }
  }

  static onEnter() {
    if (ProfileController.instance) {
      ProfileController.instance._onEnter();
    }
  }
  _onExit() {}

  _onEnter() {
    this.props.setSelectedTab(1);
    // console.log('here in onEnter');
  }
  static propTypes = {};
  onLogoutPress = () => {
    if (this.props.user.status === 'ACTIVE') {
      util.topAlert('To log out you need to first go off duty.', true);
    } else {
      this.props.userLogoutRequest(status => {
        if (status) {
          stopTracking();
          clearAllNotifications();
          Actions.reset('login');
        }
      });
    }
  };
  showBottomSheet = () => {
    BottomSheet.showBottomSheetWithOptions(
      {
        options: ['Camera', 'Gallery', 'Close'],
        title: 'Upload Image',
        dark: true,
        cancelButtonIndex: 2,
      },
      value => {
        if (value === 0) {
          ImagePicker.openCamera({
            width: IMAGE_MAX_WIDTH,
            height: IMAGE_MAX_HEIGHT,
            cropping: true,
            useFrontCamera: true,
            compressImageQuality: 0.7,
          })
            .then(image => {
              this.uploadImage(image);
            })
            .catch(e => {
              if (
                (e.code && e.code === 'E_PERMISSION_MISSING') ||
                e.code === 'E_PICKER_NO_CAMERA_PERMISSION'
              ) {
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
              } else if (e.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR') {
                Alert.alert('Error', 'No camera on simulator');
              }
            });
        }
        if (value === 1) {
          ImagePicker.openPicker({
            width: IMAGE_MAX_WIDTH,
            height: IMAGE_MAX_HEIGHT,
            cropping: true,
            compressImageQuality: 0.7,
          })
            .then(image => {
              this.uploadImage(image);
            })
            .catch(e => {
              if (e.code && e.code === 'E_PERMISSION_MISSING') {
                writeLog(e, 'from ProfileController from line 119');

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
        }
      },
    );
  };

  uploadImage = image => {
    const imagePath = image.path;
    const imageFormData = new FormData();
    const photo = {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    };
    imageFormData.append('tags', 'mobile_upload'); // Optional - add tag for image admin in Cloudinary
    imageFormData.append('upload_preset', 'gxwgoos3');
    imageFormData.append('file', photo);
    util.showLoader(this);
    this.props.uploadImageRequest(imageFormData, (status, newImage = {}) => {
      if (status) {
        const cloudImage = {
          public_id: newImage.public_id,
          version: newImage.version,
          height: newImage.height,
          width: newImage.width,
          format: newImage.format,
          bytes: newImage.bytes,
          url: newImage.url,
          secure_url: newImage.secure_url,
        };
        const payload = {};
        payload.image = cloudImage;
        this.props.userUpdateProfileRequest(payload, () => {
          util.hideLoader(this);
        });
      } else {
        util.hideLoader(this);
      }
    });
  };

  render() {
    const {imagePath} = this.state;
    return (
      <ProfileView
        {...this.props}
        onLogoutPress={this.onLogoutPress}
        imagePath={imagePath}
        onCamPress={this.showBottomSheet}
        loading={this.state.loading}
      />
    );
  }
}
const mapStateToProps = ({user, general}) => ({
  user: user.data,
  vehicles: general.vehicles,
});
const actions = {
  userLogoutRequest,
  uploadImageRequest,
  userUpdateProfileRequest,
  setSelectedTab,
};
export default connect(
  mapStateToProps,
  actions,
)(ProfileController);
