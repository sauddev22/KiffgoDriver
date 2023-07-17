import Immutable from 'seamless-immutable';
import _ from 'lodash';
import R from 'ramda';
import {
  //old
  GET_TASK_LIST,
  START_TASK,
  GET_FAILURE_REASONS,
  USER_LOGOUT,
  UPDATE_TASK,
  ADD_NEW_TASK_TO_LIST,
  GET_TASK_DETAIL,
  SET_NEW_TASK_LIST,
  SET_NEW_TASK_SEQUENCE,
  DASHBOARD_SEQUENCE_CHANGED,
  TASK_ETA_UPDATE,
  COMPLETE_TASK,
  DM_SYNC_FILE,
} from '../actions/ActionTypes';
import {NOTIFICATION_TYPES, TASK_FIELDS_NAME, TASK_STATUS} from '../constants';
import moment from 'moment';

const initialState = Immutable({
  tasks: [],
  taskHistory: [],
  reasons: [],
  offlineTasks: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    //removing saved password once saved to the keychain

    case GET_TASK_LIST.SUCCESS: {
      if (action.completed) {
        let tempTaskList = R.clone(state.taskHistory);
        tempTaskList = [...tempTaskList, ...action.data];
        return Immutable.merge(state, {
          taskHistory: _.uniqBy(tempTaskList, 'id'),
        });
      } else {
        let tempTaskList = R.clone(state.tasks);
        const indexOfTransitTaskExisting = _.findIndex(tempTaskList, {
          [TASK_FIELDS_NAME.STATUS]: TASK_STATUS.IN_TRANSIT,
        });
        const indexOfTransitTaskNew = _.findIndex(action.data, {
          [TASK_FIELDS_NAME.STATUS]: TASK_STATUS.IN_TRANSIT,
        });
        if (indexOfTransitTaskNew != -1 && indexOfTransitTaskExisting != -1) {
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.SIGNATURE] =
            tempTaskList[indexOfTransitTaskExisting][
              TASK_FIELDS_NAME.SIGNATURE
            ];
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.SIGNATURE_TIME] =
            tempTaskList[indexOfTransitTaskExisting][
              TASK_FIELDS_NAME.SIGNATURE_TIME
            ];
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.PICTURE] =
            tempTaskList[indexOfTransitTaskExisting][TASK_FIELDS_NAME.PICTURE];
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.PICTURE_TIME] =
            tempTaskList[indexOfTransitTaskExisting][
              TASK_FIELDS_NAME.PICTURE_TIME
            ];
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.IS_SUCCESS] =
            tempTaskList[indexOfTransitTaskExisting][
              TASK_FIELDS_NAME.IS_SUCCESS
            ];
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.REASON] =
            tempTaskList[indexOfTransitTaskExisting][TASK_FIELDS_NAME.REASON];
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.DRIVER_NOTES] =
            tempTaskList[indexOfTransitTaskExisting][
              TASK_FIELDS_NAME.DRIVER_NOTES
            ];
          action.data[indexOfTransitTaskNew][TASK_FIELDS_NAME.BARCODES] =
            tempTaskList[indexOfTransitTaskExisting][TASK_FIELDS_NAME.BARCODES];
        }
        return Immutable.merge(state, {
          tasks: _.uniqBy(action.data, 'id'),
        });
      }
    }
    case GET_TASK_DETAIL.SUCCESS: {
      let tempTaskList = _.cloneDeep(state.tasks);
      if (tempTaskList.length >= 0) {
        let ind = _.findIndex(tempTaskList, {
          [TASK_FIELDS_NAME.TASK_NUMBER]:
            action.data[0][TASK_FIELDS_NAME.TASK_NUMBER],
        });

        if (ind < 0) {
          tempTaskList = [...tempTaskList, ...action.data];
        }
      }

      return Immutable.merge(state, {
        tasks: _.uniqBy(tempTaskList, 'id'),
      });
    }
    case GET_FAILURE_REASONS.SUCCESS: {
      return Immutable.merge(state, {
        reasons: action.data,
      });
    }

    case START_TASK.SUCCESS: {
      const data = action.data[0];
      const tasksClone = _.cloneDeep(state.tasks);
      if (tasksClone.length) {
        const indexOfExistingTask = _.findIndex(tasksClone, {
          id: data.id,
        });
        if (indexOfExistingTask >= 0) {
          // driver already exists in list
          tasksClone[indexOfExistingTask] = data;
        }
        action.sequence.forEach(element => {
          let taskIndex = _.findIndex(tasksClone, {
            [TASK_FIELDS_NAME.TASK_NUMBER]: element.uniquestring,
          });
          if (taskIndex !== -1) {
            tasksClone[taskIndex][TASK_FIELDS_NAME.SEQUENCE] = element.sequence;
          }
        });
      }

      return Immutable.merge(state, {
        tasks: _.uniqBy(tasksClone, 'id'),
      });
    }
    case START_TASK.OFFLINE: {
      let taskNumber = action.payload.task;
      const tasksListClone = _.cloneDeep(state.tasks);

      if (tasksListClone.length) {
        const indexOfTask = _.findIndex(tasksListClone, {
          [TASK_FIELDS_NAME.TASK_NUMBER]: taskNumber,
        });
        if (!_.isNil(indexOfTask)) {
          tasksListClone[indexOfTask][TASK_FIELDS_NAME.STATUS] =
            TASK_STATUS.IN_TRANSIT;
          tasksListClone[indexOfTask][
            TASK_FIELDS_NAME.ACTUAL_START_TIME
          ] = moment().toISOString();
          tasksListClone[indexOfTask][TASK_FIELDS_NAME.IS_SYNCED] = false;
          tasksListClone[indexOfTask][TASK_FIELDS_NAME.OFFLINE_TASK] = true;
        }
      }
      return Immutable.merge(state, {
        tasks: _.uniqBy(tasksListClone, 'id'),
      });
    }
    case COMPLETE_TASK.OFFLINE: {
      let taskCompNumber = action.payload.task;
      const tasksListClone = _.cloneDeep(state.tasks);
      const offlineTasksListClone = _.cloneDeep(state.offlineTasks);
      const taskHistoryClone = _.cloneDeep(state.taskHistory);

      if (tasksListClone.length) {
        const indexOfTask = _.findIndex(tasksListClone, {
          [TASK_FIELDS_NAME.TASK_NUMBER]: taskCompNumber,
        });
        if (!_.isNil(indexOfTask)) {
          let tempOfflineTask = _.cloneDeep(tasksListClone[indexOfTask]);
          tasksListClone.splice(indexOfTask, 1);

          tempOfflineTask[TASK_FIELDS_NAME.STATUS] = tempOfflineTask[
            TASK_FIELDS_NAME.IS_SUCCESS
          ]
            ? TASK_STATUS.SUCCESS
            : TASK_STATUS.FAIL;
          tempOfflineTask[
            TASK_FIELDS_NAME.ACTUAL_END_TIME
          ] = moment().toISOString();
          tempOfflineTask[TASK_FIELDS_NAME.IS_SYNCED] = false;
          tempOfflineTask[TASK_FIELDS_NAME.OFFLINE_TASK] = true;

          offlineTasksListClone.push(tempOfflineTask);
          taskHistoryClone.push(tempOfflineTask);
        }
      }
      return Immutable.merge(state, {
        tasks: _.uniqBy(tasksListClone, 'id'),
        taskHistory: _.uniqBy(taskHistoryClone, 'id'),
        offlineTasks: _.uniqBy(offlineTasksListClone, 'id'),
      });
    }
    case UPDATE_TASK: {
      const data = action.data;

      const tasksClone = _.cloneDeep(state.tasks);
      if (tasksClone.length) {
        const indexOfExistingTask = _.findIndex(tasksClone, {
          id: data.id,
        });
        if (indexOfExistingTask >= 0) {
          // driver already exists in list
          tasksClone[indexOfExistingTask] = data;
        }
      }

      return Immutable.merge(state, {
        tasks: _.uniqBy(tasksClone, 'id'),
      });
    }
    case USER_LOGOUT.SUCCESS: {
      return Immutable.merge(state, initialState);
    }
    case ADD_NEW_TASK_TO_LIST: {
      let tempTaskList = R.clone(state.tasks);
      console.log(...tempTaskList);
      if (
        action.action === NOTIFICATION_TYPES.NEW_TASK_ASSIGNED ||
        action.action === NOTIFICATION_TYPES.MANY_TASKS_ASSIGNED
      ) {
        tempTaskList = [...tempTaskList, ...action.task.tasks_list];
        if (action.task.sequence.length > 0) {
          action.task.sequence.forEach(element => {
            let taskIndex = _.findIndex(tempTaskList, {
              [TASK_FIELDS_NAME.TASK_NUMBER]: element.uniquestring,
            });

            if (taskIndex !== -1) {
              tempTaskList[taskIndex][TASK_FIELDS_NAME.SEQUENCE] =
                element.sequence;
            }
          });
        }
      }
      if (action.action === NOTIFICATION_TYPES.TASK_UPDATED) {
        let ind = _.findIndex(tempTaskList, [
          TASK_FIELDS_NAME.TASK_NUMBER,
          action.task[0][TASK_FIELDS_NAME.TASK_NUMBER],
        ]);
        console.log({ind});
        if (ind >= 0) {
          tempTaskList[ind] = action.task[0];
        }
      }
      if (action.action === NOTIFICATION_TYPES.TASK_UNASSIGNED) {
        action.task.forEach(element => {
          let ind = _.findIndex(tempTaskList, [
            TASK_FIELDS_NAME.TASK_NUMBER,
            element,
          ]);
          if (ind >= 0) {
            tempTaskList.splice(ind, 1);
          }
        });
      }

      return Immutable.merge(state, {tasks: _.uniqBy(tempTaskList, 'id')});
    }
    case SET_NEW_TASK_SEQUENCE.SUCCESS: {
      // task sequence changed
      let finalTasksList = _.cloneDeep(state.tasks);
      action.data.tasks.forEach(element => {
        let taskIndex = _.findIndex(finalTasksList, {
          [TASK_FIELDS_NAME.TASK_NUMBER]: element.uniquestring,
        });
        if (taskIndex != -1) {
          finalTasksList[taskIndex][TASK_FIELDS_NAME.SEQUENCE] =
            element.sequence;
        }
      });

      console.log({DDDD: action.data, finalTasksList});
      return Immutable.merge(state, {
        tasks: _.uniqBy(finalTasksList, 'id'),
      });
    }

    case DASHBOARD_SEQUENCE_CHANGED: {
      let finalTasksListSequence = _.cloneDeep(state.tasks);
      action.data.forEach(element => {
        let taskIndex = _.findIndex(finalTasksListSequence, {
          [TASK_FIELDS_NAME.TASK_NUMBER]: element.uniquestring,
        });
        if (taskIndex != -1) {
          finalTasksListSequence[taskIndex][TASK_FIELDS_NAME.SEQUENCE] =
            element.sequence;
        }
      });

      console.log({DDDD: action.data, finalTasksListSequence});
      return Immutable.merge(state, {
        tasks: _.uniqBy(finalTasksListSequence, 'id'),
      });
    }
    case TASK_ETA_UPDATE: {
      let finalTasksList = _.cloneDeep(state.tasks);
      action.data.forEach(element => {
        let taskIndex = _.findIndex(finalTasksList, {
          [TASK_FIELDS_NAME.TASK_NUMBER]: element.uniquestring,
        });
        if (taskIndex !== -1) {
          finalTasksList[taskIndex][TASK_FIELDS_NAME.ETA] = element.eta;
        }
      });

      return Immutable.merge(state, {
        tasks: _.uniqBy(finalTasksList, 'id'),
      });
    }
    case DM_SYNC_FILE.SUCCESS: {
      return Immutable.merge(state, {
        offlineTasks: [],
        taskHistory: [],
        reasons: [],
      });
    }
    default:
      return state;
  }
};
