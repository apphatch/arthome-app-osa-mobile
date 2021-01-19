import { createAction } from '../../utils';
import * as actionTypes from './actionTypes';

export const saveLocation = (data) =>
  createAction(actionTypes.SAVE_LOCATION, { ...data });

export const checkLocationPermission = (data) =>
  createAction(actionTypes.CHECK_LOCATION_PERMISSION, { ...data });

export const getServerTime = () =>
  createAction(actionTypes.GET_SERVER_TIME_REQUEST);

export const getServerTimeSuccess = (response) =>
  createAction(actionTypes.GET_SERVER_TIME_SUCCESS, { ...response });

export const getServerTimeFailed = (errorMessage) =>
  createAction(actionTypes.GET_SERVER_TIME_FAILED, { errorMessage });
