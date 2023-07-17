import DataHandler from '../services/DataHandler';
import RNFS from 'react-native-fs';
import moment from 'moment';
import {
  setSyncing,
  uploadSingleImage,
  dmSyncFileRequest,
} from '../actions/GeneralActions';
import {updateTask} from '../actions/TaskActions';
import _ from 'lodash';
import {TASK_FIELDS_NAME, TASK_PROOFS, TASK_STATUS} from '../constants';
import {Platform} from 'react-native';
let objectsToWrite = [];
const syncData = async (networkStatus, callback) => {
  objectsToWrite = [];
  console.log('in syncData');

  if (networkStatus) {
    toggleLoader(true);
    const tasks = DataHandler.getStore().getState().task.tasks;
    const offlineTasks = DataHandler.getStore().getState().task.offlineTasks;
    const indexOfTransitTask = _.findIndex(tasks, task => {
      let check =
        task[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.IN_TRANSIT &&
        task[TASK_FIELDS_NAME.OFFLINE_TASK] === true &&
        task[TASK_FIELDS_NAME.IS_SYNCED] === false;
      return check;
    });

    if (indexOfTransitTask >= 0) {
      let offline_intransit_task = _.cloneDeep(tasks[indexOfTransitTask]);
      if (offline_intransit_task[TASK_FIELDS_NAME.SIGNATURE]) {
        offline_intransit_task[
          TASK_FIELDS_NAME.SIGNATURE
        ] = await checkTaskPictures(offline_intransit_task, true);
      }
      let uploadedPictures = await checkTaskPictures(offline_intransit_task);
      if (uploadedPictures.length > 0) {
        offline_intransit_task[TASK_FIELDS_NAME.PICTURE] = uploadedPictures;
      }
      objectsToWrite.push({
        task: offline_intransit_task[TASK_FIELDS_NAME.TASK_NUMBER],
        actual_start_time:
          offline_intransit_task[TASK_FIELDS_NAME.ACTUAL_START_TIME],
      });
      offline_intransit_task[TASK_FIELDS_NAME.OFFLINE_TASK] = false;
      offline_intransit_task[TASK_FIELDS_NAME.IS_SYNCED] = true;

      DataHandler.getStore().dispatch(updateTask(offline_intransit_task));
    }

    if (offlineTasks.length > 0) {
      for (let i = 0; i < offlineTasks.length; i++) {
        const task = offlineTasks[i];
        const payload = {};
        payload.task = task[TASK_FIELDS_NAME.TASK_NUMBER];
        payload.barcodes = task[TASK_FIELDS_NAME.BARCODES];
        payload.is_success = task[TASK_FIELDS_NAME.IS_SUCCESS];
        let uploadedPictures = await checkTaskPictures(task);
        payload.picture = uploadedPictures;
        payload.picture_time = task[TASK_FIELDS_NAME.PICTURE_TIME];
        let signature = {};
        if (task[TASK_FIELDS_NAME.SIGNATURE]) {
          signature = await checkTaskPictures(task, true);
        }
        payload.signature = signature;
        payload.signature_time = task.signature_time;
        payload.reason = task[TASK_FIELDS_NAME.REASON];
        payload.receiver_name = '';
        payload.distanceMiles = 0;
        payload.actual_start_time = task[TASK_FIELDS_NAME.ACTUAL_START_TIME];
        payload.actual_end_time = task[TASK_FIELDS_NAME.ACTUAL_END_TIME];
        payload.note = task[TASK_FIELDS_NAME.DRIVER_NOTES];
        objectsToWrite.push(payload);
      }
    }

    if (objectsToWrite.length > 0) {
      createTaskFile(JSON.stringify(objectsToWrite), callback);
    } else {
      toggleLoader(false);
    }
  } else {
    toggleLoader(false);
  }
};

const toggleLoader = visible => {
  DataHandler.getStore().dispatch(setSyncing(visible));
};

const uploadPicture = async imageFormData => {
  return new Promise((resolve, reject) => {
    console.log(
      DataHandler.getStore().dispatch(
        uploadSingleImage(imageFormData, async (status, newImage = {}) => {
          if (status) {
            resolve(newImage);
          } else {
            reject('failed');
          }
        }),
      ),
    );
  });
};

const checkTaskPictures = async (offline_intransit_task, signature = false) => {
  if (!signature) {
    let cloudinaryPictures = [];

    if (offline_intransit_task[TASK_FIELDS_NAME.PICTURE].length > 0) {
      for (
        let index = 0;
        index < offline_intransit_task[TASK_FIELDS_NAME.PICTURE].length;
        index++
      ) {
        const image = offline_intransit_task[TASK_FIELDS_NAME.PICTURE][index];
        if (image.isLocal) {
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
          cloudinaryPictures.push(await uploadPicture(imageFormData));
        }
      }
    }
    return cloudinaryPictures;
  } else {
    if (offline_intransit_task[TASK_FIELDS_NAME.SIGNATURE]) {
      const image = offline_intransit_task[TASK_FIELDS_NAME.SIGNATURE];
      if (image.isLocal) {
        let base64Uri = 'data:image/jpg;base64,' + image.base64;
        const imageFormData = new FormData();
        imageFormData.append('tags', 'mobile_upload'); // Optional - add tag for image admin in Cloudinary
        imageFormData.append('upload_preset', 'gxwgoos3');
        imageFormData.append('file', base64Uri);
        let sigPic = await uploadPicture(imageFormData);
        return sigPic;
      }
    }
  }
};
const createTaskFile = (data, syncDoneCallback) => {
  RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then(result => {
      const uploadFileName =
        'offlineFileee' + moment().format('MMDDYYYY-hhmmss') + '.json';
      let hasFile = false;

      result.forEach(element => {
        if (element.isFile && element.name === uploadFileName) {
          hasFile = true;
        }
      });
      if (!hasFile) {
        const newFilePath = RNFS.DocumentDirectoryPath + '/' + uploadFileName;
        RNFS.writeFile(newFilePath, data, 'utf8')
          .then(success => {
            console.log(' OFFLINE FILE WRITTEN!');
            uploadTasksFile(newFilePath, syncDoneCallback);
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    })
    .catch(err => {
      console.log(err.message, err.code);
    });
};
const uploadTasksFile = (path, syncDataCallback) => {
  const file = {
    name: 'data.json',
    uri: Platform.OS === 'android' ? 'file://' + path : path,
    type: 'text/plain',
  };
  const formData = new FormData();
  formData.append('tags', ' mobile_upload offline file'); // Optional - add tag for image admin in Cloudinary
  formData.append('upload_preset', 'gxwgoos3');
  formData.append('file', file);

  DataHandler.getStore().dispatch(
    uploadSingleImage(formData, (status, newImage) => {
      if (status) {
        DataHandler.getStore().dispatch(
          dmSyncFileRequest({file: newImage.secure_url}, status => {
            if (status) {
              toggleLoader(false);
              syncDataCallback();
              objectsToWrite = [];
              RNFS.unlink(path)
                .then(() => {
                  console.log('FILE DELETED');
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch(err => {
                  console.log(err.message);
                });
            }
          }),
        );
      }
    }),
  );
};
export {syncData};
