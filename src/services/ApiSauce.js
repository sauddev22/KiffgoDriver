// @flow
import _ from 'lodash';
import {create} from 'apisauce';
import {Actions} from 'react-native-router-flux';
import DataHandler from '../services/DataHandler';
import {stopTracking} from '../Helper/trackingHelper';
import {userLogoutSuccess} from '../actions/UserActions';
import {calculateEtaRequest} from '../actions/GeneralActions';
import {
  API_LOG,
  BASE_URL,
  API_TIMEOUT,
  ERROR_SOMETHING_WENT_WRONG,
  ERROR_NETWORK_NOT_AVAILABLE,
  ERROR_TIMEOUT,
  SET_NEW_TASK_SEQUENCE,
  START_TASK,
} from '../config/WebService';

import Util from '../util';
import {SESSION_EXPIRED_ERROR, SOMETHING_WRONG} from '../constants';
import {writeLog} from '../Helper/loggerHelper';

let timer;
const api = create({
  baseURL: `BASE_URL`,
  timeout: API_TIMEOUT,
});

const onForbidden = async () => {
  const newToken = await Util.refreshAccessToken();

  if (newToken && newToken !== 'ignore') {
    return newToken;
  }
  if (newToken !== 'ignore') {
    Actions.reset('login');
  }
  return false;
};

class ApiSauce {
  async post(url, data, headers, baseUrl) {
    console.log({url, data, headers, baseUrl});
    api.setBaseURL(baseUrl);
    const response = await api.post(url, data, {headers});

    if (__DEV__ && API_LOG) {
      console.log('url', url);
      console.log('data', data);
      console.log('headers', headers);
      console.log(response);
    }

    if (response.status === 403) {
      try {
        // Below function will store new CSRF token
        const newToken = await onForbidden();
        console.log({newToken});

        if (newToken) {
          headers.Authorization = `Bearer ${newToken}`;
        } else {
          return false;
        }
      } catch (err) {
        console.log(err);
        Util.topAlertError('Network error');
        writeLog(err, 'from ApiSause line 67');
      }

      const responseNew = await api.post(url, data, {
        headers,
      });
      console.log({responseNew});
      return this.manipulateResponse(responseNew, url, data);
    } else {
      return this.manipulateResponse(response, url, data);
    }
  }

  async get(url, data, headers, baseUrl) {
    api.setBaseURL(baseUrl);
    const response = await api.get(url, data, {
      headers,
    });

    if (__DEV__ && API_LOG) {
      console.log('url', url);
      console.log('headers', headers);
      console.log(response);
    }

    return this.manipulateResponse(response, url, data);
  }

  async delete(url, data, headers, baseUrl) {
    api.setBaseURL(baseUrl);
    const response = await api.delete(
      url,
      {},
      {
        headers,
      },
    );

    if (__DEV__ && API_LOG) {
      console.log('url', url);
      console.log('headers', headers);
      console.log(response);
    }

    return this.manipulateResponse(response, url, data);
  }

  async put(url, data, headers, baseUrl) {
    api.setBaseURL(baseUrl);

    const response = await api.put(url, data, headers);

    if (__DEV__ && API_LOG) {
      console.log('url', url);
      console.log('data', data);
      console.log('headers', headers);
      console.log(response);
    }

    return this.manipulateResponse(response, url, data);
  }

  manipulateResponse(response, url, data) {
    return new Promise((resolve, reject) => {
      if (response.ok && response.data && !response.data.error) {
        if (url === SET_NEW_TASK_SEQUENCE.route || url === START_TASK.route) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            DataHandler.getStore().dispatch(calculateEtaRequest());
          }, 20000);
        }
        resolve(response.data);
      } else {
        if (response.status === 401) {
          Actions.reset('login');
          DataHandler.getStore().dispatch(userLogoutSuccess());
          stopTracking('refresh token fail');
          console.log('user logout on 401 response');
          if (!_.isEmpty(response.data.message)) {
            reject(response);
          } else {
            reject({data: {message: SESSION_EXPIRED_ERROR}});
          }
        }
        if (response.status === 400) {
          reject(
            response.data.message
              ? response
              : {data: {message: ERROR_SOMETHING_WENT_WRONG.message}},
          );
        }
        if (response.status === 500) {
          reject({data: {message: ERROR_SOMETHING_WENT_WRONG.message}});
        }
        console.log({response});
        if (response.problem === 'NETWORK_ERROR') {
          reject({data: {message: ERROR_NETWORK_NOT_AVAILABLE.message}});
        }

        if (response.problem === 'TIMEOUT_ERROR') {
          reject({data: {message: ERROR_TIMEOUT.message}});
        }

        reject(
          response || {
            data: {message: ERROR_NETWORK_NOT_AVAILABLE.message},
          },
        );
      }
    });
  }
}

export default new ApiSauce();
