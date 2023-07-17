import React from 'react';
import PropTypes from 'prop-types';
import SignatureView from './SignatureView';
import RNFS from 'react-native-fs';
import {TASK_FIELDS_NAME, DATE_TIME_FORMAT1} from '../../../constants';
import _ from 'lodash';
import moment from 'moment-timezone';
import {uploadSingleImage} from '../../../actions/GeneralActions';
import {updateTask} from '../../../actions/TaskActions';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import util from '../../../util';
import {PermissionsAndroid, Platform} from 'react-native';
import {writeLog} from '../../../Helper/loggerHelper';

class SignatureController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDrawing: false,
      loading: false,
    };
  }
  static propTypes = {
    taskId: PropTypes.number.isRequired,
    task: PropTypes.object.isRequired,
    uploadSingleImage: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
  };
  static defaultProps = {};
  saveSign = () => {
    this.signRef.readSignature();
    console.log({checking: this.signRef});
  };

  resetSign = () => {
    this.signRef.clearSignature();
    this.setState({startDrawing: false});
  };
  async componentDidMount() {
    try {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
      writeLog(err, 'from SignatureController from line 49');
    }
  }
  _onSaveEvent = result => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log({result});

    const imagePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;
    const imageDatas = result.split('data:image/png;base64,');

    RNFS.writeFile(imagePath, imageDatas[1], 'base64')
      .then(() => {
        console.log('Image converted to jpg and saved at ' + imagePath);
        Actions.pop();
        this.props.onDone(imagePath);
      })
      .catch(err => {
        console.log({err});
        writeLog(err, 'from SignatureController from line 68');
      });
  };
  _onDragEvent = () => {
    this.setState({startDrawing: true});
  };
  render() {
    return (
      <SignatureView
        {...this.props}
        startDrawing={this.state.startDrawing}
        loading={this.state.loading}
        saveSign={this.saveSign}
        resetSign={this.resetSign}
        _onSaveEvent={this._onSaveEvent}
        _onDragEvent={this._onDragEvent}
        signRef={ref => {
          this.signRef = ref;
        }}
      />
    );
  }
}

const mapStateToProps = ({task}, props) => {
  task = _.find(task.tasks, {id: props.taskId});
  return {task};
};
const actions = {uploadSingleImage, updateTask};
export default connect(
  mapStateToProps,
  actions,
)(SignatureController);
