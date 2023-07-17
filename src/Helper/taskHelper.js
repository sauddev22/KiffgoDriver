import {TASK_FIELDS_NAME, CENTRAL_LONDON, TASK_STATUS} from '../constants';
import _ from 'lodash';
import moment from 'moment-timezone';
import util from '../util';
import {writeLog} from '../Helper/loggerHelper';

const makeTimeLine = data => {
  if (data) {
    let i = -1;
    const barcodeItem = _.find(data, (item, index) => {
      i = index;
      return item.key === 'added_barcode';
    });
    const newData = _.remove(data, x => x.key !== 'added_barcode');
    console.log({newData});
    return newData.splice(i, 0, barcodeItem);
  } else {
    return [];
  }
};

const makeTaskData = data => {
  const fineData = [];
  if (_.isArray(data)) {
    data.forEach((innerElement, index) => {
      // task layer
      //adding inner ids to barcodes;
      const newBarList = [];
      try {
        if (innerElement.barcodes && innerElement.barcodes.length > 0) {
          innerElement.barcodes.forEach(item => {
            item.innerId = util.generateGuid();
            newBarList.push(item);
          });
        }
      } catch (error) {
        console.log('error is here   ' + error);
        writeLog(error, 'from taskjHelper line 37');
      }

      let taskTimeLine = _.cloneDeep(innerElement[TASK_FIELDS_NAME.TIMELINE]);
      try {
        let i = -1;
        const barcodeItem = _.find(taskTimeLine, (item, index) => {
          i = index;
          return item.key === 'added_barcode';
        });
        if (barcodeItem) {
          taskTimeLine = _.remove(taskTimeLine, x => x.key !== 'added_barcode');
          taskTimeLine.splice(i, 0, barcodeItem);
        }

        console.log({taskTimeLine});
      } catch (error) {
        console.log(error);
        writeLog(error, 'from taskjHelper line 55');
      }

      const taskDetail = {
        [TASK_FIELDS_NAME.TIMELINE]: taskTimeLine || [],
        [TASK_FIELDS_NAME.ID]: innerElement.id || 0,
        [TASK_FIELDS_NAME.RECIPIENT_NAME]:
          innerElement.contactName || 'No recipient',
        [TASK_FIELDS_NAME.RECIPIENT_PHONE]: innerElement.contactPhone || '',
        [TASK_FIELDS_NAME.RECIPIENT_EMAIL]: innerElement.contactEmail || ' - ',
        [TASK_FIELDS_NAME.RECIPIENT_NOTES]:
          innerElement.instructions || 'No notes',
        [TASK_FIELDS_NAME.INTERNAL_ORDER_NUMBER]:
          innerElement.internalOrder || ' No ID ',
        [TASK_FIELDS_NAME.QUANTITY]: innerElement.quantity || 0,
        [TASK_FIELDS_NAME.IS_PICKUP]: innerElement.is_collection || false,
        [TASK_FIELDS_NAME.IS_DROPOFF]: innerElement.is_delivery || false,
        [TASK_FIELDS_NAME.DESCRIPTION]:
          innerElement.description || 'No description',
        [TASK_FIELDS_NAME.LOCATION_ADDRESS]:
          innerElement.fullAddress || innerElement.location.address || '',
        [TASK_FIELDS_NAME.LOCATION_POSTCODE]:
          innerElement.postcode || innerElement.location.postcode || '',
        [TASK_FIELDS_NAME.LOCATION_CITY]:
          innerElement.city || innerElement.location.city || '',
        [TASK_FIELDS_NAME.LOCATION_BUSINESS_NAME]: innerElement.company || '',
        [TASK_FIELDS_NAME.DESTINATION_NOTES]:
          innerElement.destination_notes || 'No notes',
        [TASK_FIELDS_NAME.DRIVER_NOTES]: innerElement.driver_notes || '  ',
        [TASK_FIELDS_NAME.COMPLETE_AFTER]: innerElement.earliest_time || '',
        [TASK_FIELDS_NAME.COMPLETE_BEFORE]: innerElement.latest_time || '',
        [TASK_FIELDS_NAME.SERVICE_MIN]: innerElement.service_minutes || 0,
        [TASK_FIELDS_NAME.PROOF]: innerElement.proof || [],
        [TASK_FIELDS_NAME.PICTURE]: innerElement.pictures || [],
        [TASK_FIELDS_NAME.PICTURE_TIME]: innerElement.picture_time || '',
        [TASK_FIELDS_NAME.IS_SUCCESS]: innerElement.is_success || true,
        [TASK_FIELDS_NAME.REASON]: innerElement.reason || '',
        [TASK_FIELDS_NAME.DURATION]: innerElement.duration_stop_sec || 0,
        [TASK_FIELDS_NAME.SIGNATURE]: innerElement.signature || {},
        [TASK_FIELDS_NAME.SIGNATURE_TIME]: innerElement.signature_time || '',
        [TASK_FIELDS_NAME.DRIVER_ID]:
          (innerElement.driver && innerElement.driver.id) || null,
        [TASK_FIELDS_NAME.DRIVER_NAME]:
          (innerElement.driver && innerElement.driver.name) || ' - ',
        [TASK_FIELDS_NAME.DRIVER_PHONE]:
          (innerElement.driver && innerElement.driver.phone) || ' - ',
        [TASK_FIELDS_NAME.STATUS]:
          innerElement.status || TASK_STATUS.UNASSIGNED,
        [TASK_FIELDS_NAME.DELAYED_IN_MINUTES]:
          innerElement.delayedInMinutes || 0,
        [TASK_FIELDS_NAME.LOCATION_LATITUDE]: innerElement.location
          ? innerElement.location.latitude || CENTRAL_LONDON.lat
          : null,
        [TASK_FIELDS_NAME.LOCATION_LONGITUDE]: innerElement.location
          ? innerElement.location.longitude || CENTRAL_LONDON.lng
          : null,
        [TASK_FIELDS_NAME.ETA]: innerElement.eta || null,
        [TASK_FIELDS_NAME.CREATED_AT]:
          innerElement.createdAt || moment().toISOString(),
        [TASK_FIELDS_NAME.UPDATED_AT]:
          innerElement.updatedAt || moment().toISOString(),
        [TASK_FIELDS_NAME.TASK_NUMBER]: innerElement.uniquestring || null,
        [TASK_FIELDS_NAME.OWNER]: _.isUndefined(innerElement.owner)
          ? ''
          : innerElement.owner.firstName + ' ' + innerElement.owner.lastName,
        [TASK_FIELDS_NAME.SEQUENCE]: innerElement.sequence || -1,
        [TASK_FIELDS_NAME.COUNTRY_NAME]:
          innerElement.country || innerElement.location.country || '',
        [TASK_FIELDS_NAME.STREET_NAME]:
          innerElement.street_name || innerElement.location.street || '',
        [TASK_FIELDS_NAME.STREET_NUMBER]:
          innerElement.street_number || innerElement.location.number || '',
        [TASK_FIELDS_NAME.LOCATION_BUILDING]:
          innerElement.building || innerElement.location.building || '',
        [TASK_FIELDS_NAME.BARCODES]: newBarList,
        [TASK_FIELDS_NAME.BARCODES_BACKUP]: newBarList,
      };

      if (taskDetail[TASK_FIELDS_NAME.STATUS] === TASK_STATUS.UNASSIGNED) {
        // setting delay in minutes for unassigned tasks
        const diffInMinutes = moment().diff(
          moment(taskDetail[TASK_FIELDS_NAME.ETA]),
          'minutes',
        );

        if (diffInMinutes > 0) {
          // is delayed
          taskDetail[TASK_FIELDS_NAME.DELAYED_IN_MINUTES] = diffInMinutes;
        }
      }
      fineData.push(taskDetail);
    });
  } else {
    console.error('data sent to makeTaskData function is no an array');
  }

  return fineData;
};
const getLocationText = location => {
  const businessName = location[TASK_FIELDS_NAME.LOCATION_BUSINESS_NAME];
  const buildingName = location[TASK_FIELDS_NAME.LOCATION_BUILDING];
  const streetNumber = location[TASK_FIELDS_NAME.STREET_NUMBER];
  const address = location[TASK_FIELDS_NAME.LOCATION_ADDRESS];
  const streetName = !_.isEmpty(location[TASK_FIELDS_NAME.STREET_NAME])
    ? !_.isEmpty(streetNumber)
      ? `${streetNumber}, ${location[TASK_FIELDS_NAME.STREET_NAME]}`
      : location[TASK_FIELDS_NAME.STREET_NAME]
    : '';
  const postCode = location[TASK_FIELDS_NAME.LOCATION_POSTCODE];
  const town = location[TASK_FIELDS_NAME.LOCATION_CITY];
  const country = location[TASK_FIELDS_NAME.COUNTRY_NAME];

  let finalText = '';
  let firstPart = '';
  let lastPart = '';

  firstPart = !_.isEmpty(address) ? `${address}` : firstPart;
  firstPart = !_.isEmpty(postCode) ? `${postCode}` : firstPart;
  firstPart = !_.isEmpty(streetName) ? `${streetName}` : firstPart;
  firstPart = !_.isEmpty(buildingName) ? `${buildingName}` : firstPart;
  firstPart = !_.isEmpty(businessName) ? `${businessName}` : firstPart;
  lastPart = !_.isEmpty(town) ? `${town}` : `${country}`;
  finalText = !_.isEmpty(firstPart)
    ? `${firstPart}, ${lastPart}`
    : `${lastPart}`;
  return finalText;
};
export {makeTaskData, getLocationText};
