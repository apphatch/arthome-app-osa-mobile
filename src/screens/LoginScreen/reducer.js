import { createReducer } from '../../utils';
import * as actionTypes from './actionTypes';

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  token: null,
  authorization: null,
  user_id: null,
  errorMessage: '',
};

const handlers = {
  [actionTypes.LOGIN_REQUEST]: loginRequest,
  [actionTypes.LOGIN_FAILED]: loginFailed,
  [actionTypes.LOGIN_RESPONSE]: loginResponse,

  [actionTypes.LOGOUT_REQUEST]: logoutRequest,
  [actionTypes.LOGOUT_RESPONSE]: logoutResponse,
  [actionTypes.LOGOUT_FAILED]: logoutFailed,

  [actionTypes.UPDATE_AUTH]: updateAuthorization,
};

export default createReducer(initialState, handlers);

function loginRequest(state, action) {
  state.isLoading = true;
  state.isLoggedIn = false;
  state.errorMessage = '';
}

function loginFailed(state, action) {
  state.isLoggedIn = false;
  state.isLoading = false;
  state.token = null;
  state.authorization = null;
  state.user_id = null;
  state.errorMessage = action.payload.errorMessage;
}
function loginResponse(state, action) {
  state.isLoggedIn = true;
  state.isLoading = false;
  state.token = action.payload.token;
  state.authorization = action.payload.authorization;
  state.user_id = action.payload.user_id;
}

function logoutRequest(state, action) {
  state.isLoading = true;
}
function logoutResponse(state, action) {
  state.token = null;
  state.authorization = null;
  state.isLoggedIn = false;
  state.user_id = null;
  state.isLoading = false;
}
function logoutFailed(state, action) {
  state.isLoading = false;
}

function updateAuthorization(state, action) {
  state.authorization = action.payload.authorization;
}
