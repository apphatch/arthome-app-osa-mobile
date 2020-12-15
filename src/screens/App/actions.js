import { createAction } from '../../utils';
import * as actionTypes from './actionTypes';

export const saveLocation = (data) =>
  createAction(actionTypes.SAVE_LOCATION, { ...data });

export const checkLocationPermission = (data) =>
  createAction(actionTypes.CHECK_LOCATION_PERMISSION, { ...data });
