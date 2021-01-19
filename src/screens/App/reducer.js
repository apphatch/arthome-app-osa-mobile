import { createReducer } from '../../utils';
import * as actionTypes from './actionTypes';

const initialState = {
  location: null,
  granted: false,
  isLoading: false,
  errorMessage: '',
  serverTime: '',
};

const handlers = {
  [actionTypes.SAVE_LOCATION]: saveLocation,
  [actionTypes.CHECK_LOCATION_PERMISSION]: checkLocationPermission,
  [actionTypes.GET_SERVER_TIME_REQUEST]: getServerTime,
  [actionTypes.GET_SERVER_TIME_SUCCESS]: getServerTimeSuccess,
  [actionTypes.GET_SERVER_TIME_FAILED]: getServerTimeFailed,
};

export default createReducer(initialState, handlers);

function saveLocation(state, action) {
  state.location = action.payload.location;
}

function checkLocationPermission(state, action) {
  state.granted = action.payload.granted;
}

function getServerTime(state, action) {
  state.isLoading = true;
  state.errorMessage = '';
}

function getServerTimeSuccess(state, action) {
  state.isLoading = false;
  state.serverTime = action.payload.time;
}

function getServerTimeFailed(state, action) {
  state.isLoading = false;
  state.errorMessage = action.payload.errorMessage;
}
