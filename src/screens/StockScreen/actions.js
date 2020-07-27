import { createAction } from '../../utils';
import * as actionTypes from './actionTypes';

export const fetchStocks = ({ params }) =>
  createAction(actionTypes.FETCH_STOCKS, { params });
export const fetchStocksSuccess = (response) =>
  createAction(actionTypes.FETCH_STOCKS_SUCCESS, { ...response });
export const fetchStocksFailed = () =>
  createAction(actionTypes.FETCH_STOCKS_FAILED);
