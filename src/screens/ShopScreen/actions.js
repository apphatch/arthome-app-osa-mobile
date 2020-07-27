import { createAction } from '../../utils';
import * as actionTypes from './actionTypes';

export const fetchShops = (params) =>
  createAction(actionTypes.FETCH_SHOPS, { ...params });
export const fetchShopsSuccess = (response) =>
  createAction(actionTypes.FETCH_SHOPS_SUCCESS, { ...response });
export const fetchShopsFailed = () =>
  createAction(actionTypes.FETCH_SHOPS_FAILED);
