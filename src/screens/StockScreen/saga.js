import {
  put,
  // call,
  select,
  delay,
  all,
  takeLatest,
} from 'redux-saga/effects';

import * as actions from './actions';
import * as actionTypes from './actionTypes';

import { selectors as loginSelectors } from '../LoginScreen';

// ## API
// import * as API from './services';

// dump
import { data } from './data';

export function* fetchStocks() {
  try {
    // const response = yield call(API.fetchShops);
    yield delay(3000);
    yield put(actions.fetchStocksSuccess({ stocks: data }));
  } catch (error) {
    yield put(actions.fetchStocksFailed(error.message));
  }
}

export default function root() {
  return function* watch() {
    yield all([yield takeLatest(actionTypes.FETCH_STOCKS, fetchStocks)]);
  };
}
