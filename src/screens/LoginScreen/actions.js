import { createAction } from '../../utils';
import * as actionTypes from './actionTypes';

export const requestLogin = (username, password, setError) =>
  createAction(actionTypes.LOGIN_REQUEST, { username, password, setError });

export const onLoginResponse = (response) =>
  createAction(actionTypes.LOGIN_RESPONSE, { ...response });

export const loginFailed = (errorMessage) =>
  createAction(actionTypes.LOGIN_FAILED, { errorMessage });

export const logout = () => createAction(actionTypes.LOGOUT_REQUEST, {});
export const onLogoutSuccess = () => createAction(actionTypes.LOGOUT_RESPONSE);
export const logoutFailed = (errorMessage) =>
  createAction(actionTypes.LOGOUT_FAILED, { errorMessage });

export const updateAuthorization = (authorization) =>
  createAction(actionTypes.UPDATE_AUTH, { authorization });
