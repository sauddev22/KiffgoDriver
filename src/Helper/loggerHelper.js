import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import moment from 'moment';
import {logFileName} from '../constants';
import DataHandler from '../services/DataHandler';
import {uploadSingleImage, addLogsToServer} from '../actions/GeneralActions';

const createLogFile = () => {
  RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then(result => {
      const kiffgoFileName = logFileName + moment().format('MMDDYYYY') + '.txt';
      let hasFile = false;

      result.forEach(element => {
        if (element.isFile && element.name === kiffgoFileName) {
          hasFile = true;
        }
      });
      if (!hasFile) {
        const newFilePath = RNFS.DocumentDirectoryPath + '/' + kiffgoFileName;
        RNFS.writeFile(
          newFilePath,
          'Kiffgo Log file new app ' +
            kiffgoFileName +
            ' begin ' +
            moment().format('MM-DD-YYYY hh:mm a'),
          'utf8',
        )
          .then(success => {
            console.log('FILE WRITTEN!');
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
const writeLog = (text, from) => {
  const kiffgoFileName = logFileName + moment().format('MMDDYYYY') + '.txt';
  const logFilePath = RNFS.DocumentDirectoryPath + '/' + kiffgoFileName;
  RNFS.write(
    logFilePath,
    '\n\n' +
      '  ->  ' +
      moment().format('MM-DD-YYYY hh:mm a') +
      ' ' +
      from +
      '\n' +
      text,
    -1,
    'utf8',
  )
    .then(success => {
      console.log('success  ' + success);
    })
    .catch(error => {
      console.log('error   ' + error);
    });
};
const readLogs = () => {
  RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then(results => {
      // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      results.forEach(element => {
        if (element.isFile && element.name.includes(logFileName)) {
          // console.log('file://' + element.path);
          return RNFS.readFile('file://' + element.path, 'utf8')
            .then(content => {
              // console.log('some content ' + content);
            })
            .catch(err => {
              console.log('some content error ' + err);
            });
        }
      });
    })

    .catch(error => {
      console.log('error reading directory  ' + error);
    });
};
const uploadLogFiles = (callback, value, comments, fromHelp) => {
  RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then(results => {
      let file = null;
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        if (element.isFile && element.name.includes(logFileName)) {
          file = {
            name: element.name,
            uri:
              Platform.OS === 'android'
                ? 'file://' + element.path
                : element.path,
            type: 'text/plain',
          };
          break;
        }
      }

      const user = DataHandler.getStore().getState().user.data;
      if (file) {
        const formData = new FormData();
        formData.append('tags', ' mobile_upload log file'); // Optional - add tag for image admin in Cloudinary
        formData.append('upload_preset', 'gxwgoos3');
        formData.append('file', file);
        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
        DataHandler.getStore().dispatch(
          uploadSingleImage(formData, (status, newImage) => {
            if (status) {
              // console.log(newImage);
              let payload = {};
              payload.link = newImage.secure_url;
              payload.public_id = newImage.public_id;
              payload.comment = comments;
              if (user) {
                payload.driver = user.id;
              }
              DataHandler.getStore().dispatch(
                addLogsToServer(payload, status => {
                  if (status) {
                    console.log('logs uploaded');
                    if (!fromHelp) {
                      const path = RNFS.DocumentDirectoryPath + '/' + file.name;

                      RNFS.unlink(path)
                        .then(() => {
                          console.log('FILE DELETED');
                          callback(value);
                        })
                        // `unlink` will throw an error, if the item to unlink does not exist
                        .catch(err => {
                          console.log(err.message);
                          callback(value);
                        });
                    } else {
                      callback();
                    }
                  }
                }),
              );
            } else {
              callback(value);
            }
          }),
        );
      } else {
        let payload = {};
        payload.link = 'no file found';
        payload.public_id = 'no file found';
        payload.comment = comments;
        if (user) {
          payload.driver = user.id;
        }
        DataHandler.getStore().dispatch(
          addLogsToServer(payload, status => {
            if (status) {
              console.log('logs uploaded');
              if (!fromHelp) {
                const path = RNFS.DocumentDirectoryPath + '/' + file.name;
                RNFS.unlink(path)
                  .then(() => {
                    console.log('FILE DELETED');
                    callback(value);
                  })
                  // `unlink` will throw an error, if the item to unlink does not exist
                  .catch(err => {
                    console.log(err.message);
                    callback(value);
                  });
              } else {
                callback();
              }
            }
          }),
        );
      }
    })
    .catch(error => {
      console.log('error reading directory  ' + error);
      callback(value);
    });
};
export {createLogFile, writeLog, readLogs, uploadLogFiles};
