import { createReducer } from '../../utils';
import * as actionTypes from './actionTypes';

const initialState = {
  isCheckIn: false,
  isLoading: false,
  checkInData: {},
};

const handlers = {
  [actionTypes.CHECK_IN_REQUEST]: checkInRequest,
  [actionTypes.CHECK_IN_RESPONSE]: checkInResponse,
  [actionTypes.CHECK_IN_FAILED]: checkInFailed,

  [actionTypes.CHECK_OUT_REQUEST]: checkOutRequest,
  [actionTypes.CHECK_OUT_RESPONSE]: checkOutResponse,
  [actionTypes.CHECK_OUT_FAILED]: checkOutFailed,
};

export default createReducer(initialState, handlers);

function checkInRequest(state, action) {
  state.isLoading = true;
  state.isCheckIn = false;
  state.isReport = false;
}

function checkInResponse(state, action) {
  state.isLoading = false;
  state.isCheckIn = action.payload.isCheckIn;
  state.checkInData = action.payload.checkInData;
  state.isReport = false;
}

function checkInFailed(state, action) {
  state.isLoading = false;
  state.isCheckIn = false;
  state.isReport = false;
}

function checkOutRequest(state, action) {
  state.isLoading = true;
}

function checkOutResponse(state, action) {
  state.isLoading = false;
  state.isCheckIn = false;
  state.checkInData = {};
}

function checkOutFailed(state, action) {
  state.isLoading = false;
}
