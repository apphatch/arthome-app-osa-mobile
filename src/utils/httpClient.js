import Config from 'react-native-config';
import axios from 'axios';
import { actions as loginActions } from '../screens/LoginScreen';

const internals = {};
const UNAUTHORIZED = 401;
// create an instance of axios
const instance = axios.create({
  // baseURL: 'http://54.251.164.171',
  baseURL: Config.API_HOST,
  headers: { 'Content-Type': 'application/json', App: 'osa-mobile' },
});

internals.get = (url, params, options) => {
  let config = {
    method: 'GET',
    url: url,
    params,
  };
  config = Object.assign(config, options);
  return instance(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('internals.get -> error', error);
      throw new Error(error);
    });
};

internals.post = (url, payload, options) => {
  let config = {
    method: 'POST',
    url: url,
    data: payload,
  };
  config = Object.assign(config, options);
  return instance(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('internals.post -> error', error);
      throw new Error(error);
    });
};

internals.put = (url, payload, options) => {
  let config = {
    method: 'PUT',
    url: url,
    data: payload,
  };
  config = Object.assign(config, options);
  return instance(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('internals.put -> error', error);
      throw new Error(error);
    });
};

export default internals;
// export { instance };

const setupInterceptors = (store) => {
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error);
      const { status } = error.response;
      console.log('status', status);
      if (status === UNAUTHORIZED || status === 500) {
        store.dispatch(loginActions.logout());
      }
      return Promise.reject(error);
    },
  );
};

export { setupInterceptors };
