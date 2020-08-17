import { put, call, select, all, takeLatest } from 'redux-saga/effects';
import { mapValues } from 'lodash';

import * as actions from './actions';
import * as actionTypes from './actionTypes';

// ## API
import * as API from './services';
import * as selectors from './selectors';

import { logger } from '../../utils';

import {
  selectors as loginSelectors,
  actions as loginActions,
} from '../LoginScreen';

export function* submitCheckList({ payload }) {
  const { itemId, data, shopId } = payload;
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    const token = yield select(loginSelectors.makeSelectToken());
    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );

    const res = yield call(API.submitCheckListItemData, {
      itemId,
      data: formData,
      token,
      authorization,
    });
    // const response = yield call(API.fetchCheckList, { shopId });
    // yield put(actions.checkListResponse({ checkList: response.data }));
    yield put(actions.submitSuccess({ itemId, data }));
    yield put(loginActions.updateAuthorization(res.headers.authorization));
  } catch (error) {
    console.log('function*submitCheckList -> error', error);
    yield put(actions.submitFailed(error.message));
  }
}

export function* fetchCheckList({ payload }) {
  try {
    const token = yield select(loginSelectors.makeSelectToken());
    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );
    const { shopId } = payload;
    const response = yield call(API.fetchCheckList, {
      shopId,
      token,
      authorization,
    });

    yield put(actions.checkListResponse({ checkList: response.data }));
    yield put(loginActions.updateAuthorization(response.headers.authorization));
  } catch (error) {
    console.log('function*fetchCheckList -> error', error);
    yield put(actions.fetchCheckListFailed(error.message));
  }
}

export function* markDoneAllCheckListItems({ payload: { clId, clType } }) {
  try {
    const stocksHasDataNull = yield select(
      selectors.makeSelectStocksHasDataNull(),
    );
    const token = yield select(loginSelectors.makeSelectToken());
    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );
    const currentCl = yield select(selectors.makeSelectCheckListById(clId));
    const { template } = currentCl;
    let data = [];
    const formData = new FormData();

    if (currentCl.checklist_type.toUpperCase() === 'OOS') {
      data = stocksHasDataNull.map((item) => {
        return {
          id: item.id,
          data: mapValues(template, (o) => {
            if (o.type === 'select') {
              return o.values[0];
            }
            return '';
          }),
        };
      });
    } else {
      data = stocksHasDataNull.map((item) => {
        return {
          id: item.id,
          data: mapValues(template, (o) => {
            if (o.type === 'input') {
              return '';
            }
            return '';
          }),
        };
      });
    }
    logger('function*markDoneAllCheckListItems -> data', data);
    formData.append('checklist_items', JSON.stringify(data));
    const res = yield call(API.markDoneAll, {
      data: formData,
      token,
      authorization,
      clId,
    });
    yield put(actions.markDoneAllSuccess());
    yield put(loginActions.updateAuthorization(res.headers.authorization));
    yield put(actions.fetchStocks({ search: '', checkListId: clId }));
  } catch (error) {
    yield put(actions.markDoneAllFailed(error.message));
  }
}

export function* fetchStocks({ payload }) {
  try {
    const token = yield select(loginSelectors.makeSelectToken());
    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );
    const { filter } = payload;
    const res = yield call(API.fetchStockByCheckList, {
      ...payload,
      token,
      authorization,
    });
    let categories = [];
    res.data.forEach(function (item) {
      var existing = categories.filter(function (v, i) {
        return v === item.category;
      });
      if (existing.length <= 0) {
        categories.push(item.category);
      }
    });

    res.data.sort((a, b) => {
      if (a.category === b.category) {
        if (a.sub_category === b.sub_category) {
          return a.stock_name > b.stock_name ? 1 : -1;
        }
        return a.sub_category > b.sub_category ? 1 : -1;
      }
      return a.category > b.category ? 1 : -1;
    });

    let newData;
    if (filter !== '') {
      newData = res.data.filter((item) => item.category === filter);
    } else {
      newData = res.data;
    }
    yield put(actions.stocksResponse({ stocks: newData, categories }));
    yield put(loginActions.updateAuthorization(res.headers.authorization));
  } catch (error) {
    yield put(actions.fetchStocksFailed(error.message));
  }
}

export default function root() {
  return function* watch() {
    yield all([
      yield takeLatest(actionTypes.SUBMIT, submitCheckList),
      yield takeLatest(actionTypes.FETCH_CHECK_LIST, fetchCheckList),
      yield takeLatest(actionTypes.MARK_DONE_ALL, markDoneAllCheckListItems),
      yield takeLatest(actionTypes.FETCH_STOCKS, fetchStocks),
    ]);
  };
}
