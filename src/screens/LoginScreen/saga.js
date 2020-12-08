import { put, call, select, delay, all, takeLatest } from 'redux-saga/effects';
import _ from 'lodash';

import * as actions from './actions';
import * as selectors from './selectors';
import * as actionTypes from './actionTypes';
import { actions as checkInActions } from '../CheckInScreen';

// ## API
import * as API from './services';

export function* login({ payload }) {
  const { username, password, setError } = payload;
  try {
    yield delay(2000);
    const response = yield call(API.login, { username, password });
    const {
      data: { user_id, last_checkin_checkout = {}, shop },
    } = response;
    if (shop !== null) {
      last_checkin_checkout.name = shop.name;
    }
    yield put(
      actions.onLoginResponse({
        user_id,
      }),
    );
    yield put(
      checkInActions.onCheckInResponse({
        checkInData: last_checkin_checkout,
        isCheckIn: _.isEmpty(last_checkin_checkout)
          ? false
          : last_checkin_checkout.is_checkin,
        isReport: false,
      }),
    );
    yield put(actions.updateAuthorization(response.headers.authorization));
  } catch (error) {
    yield put(actions.loginFailed(error.message));
    setError('Đăng nhập không thành công');
  }
}

export function* logout() {
  try {
    const response = yield call(API.logout);
    yield put(actions.onLogoutSuccess());
    yield put(checkInActions.onCheckOutResponse(response));
  } catch (error) {
    console.log('TCL: function*logout -> error', error);
    yield put(actions.logoutFailed(''));
  }
}

export default function root() {
  return function* watch() {
    yield all([
      yield takeLatest(actionTypes.LOGIN_REQUEST, login),
      yield takeLatest(actionTypes.LOGOUT_REQUEST, logout),
    ]);
  };
}
