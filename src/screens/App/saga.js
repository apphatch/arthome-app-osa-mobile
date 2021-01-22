import { put, call, select, all, takeLatest, delay } from 'redux-saga/effects';

import * as actions from './actions';
import * as actionTypes from './actionTypes';

// ## API
import * as API from './services';

import {
  selectors as loginSelectors,
  actions as loginActions,
} from '../LoginScreen';

import { logger } from '../../utils';

export function* getServerTime() {
  try {
    yield delay(0);
    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );
    const response = yield call(API.getServerTime, { authorization });
    console.log(response);
    yield put(
      actions.getServerTimeSuccess({ time: response.data.server_time }),
    );

    yield put(loginActions.updateAuthorization(response.headers.authorization));
  } catch (error) {
    logger('function*getServerTime -> error', error);
    yield put(actions.getServerTimeFailed('Server Time Error'));
  }
}

export default function root() {
  return function* watch() {
    yield all([
      yield takeLatest(actionTypes.GET_SERVER_TIME_REQUEST, getServerTime),
    ]);
  };
}
