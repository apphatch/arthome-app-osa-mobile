import { put, call, select, all, takeLatest } from 'redux-saga/effects';
import UUIDGenerator from 'react-native-uuid-generator';
import moment from 'moment';
import _ from 'lodash';

import * as actions from './actions';
import * as actionTypes from './actionTypes';

// ## API
import * as API from './services';

import {
  selectors as loginSelectors,
  actions as loginActions,
} from '../LoginScreen';

export function* checkIn({ payload }) {
  try {
    const { note, photo, shopId, latitude, longitude } = payload;
    const formData = new FormData();
    const photoName = yield UUIDGenerator.getRandomUUID();
    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );

    formData.append('photo', {
      uri: photo,
      type: 'image/jpeg',
      name: photoName,
    });
    formData.append('note', note);
    formData.append('time', moment().format('DD/MM/YYYY'));
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    const response = yield call(API.checkIn, {
      formData,
      authorization,
      shopId,
    });
    const {
      data: { last_checkin_checkout = {} },
    } = response;
    yield put(
      actions.onCheckInResponse({
        checkInData: last_checkin_checkout,
        isCheckIn: !_.isEmpty(last_checkin_checkout),
      }),
    );
    yield put(loginActions.updateAuthorization(response.headers.authorization));
  } catch (error) {
    console.log('function*login -> error', error);
    yield put(actions.checkInFailed(error.message));
  }
}

export function* checkOut({ payload }) {
  try {
    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );
    const { note, photo, shopId, latitude, longitude, incomplete } = payload;
    const formData = new FormData();
    const photoName = yield UUIDGenerator.getRandomUUID();
    formData.append('photo', {
      uri: photo,
      type: 'image/jpeg',
      name: photoName,
    });
    formData.append('note', note);
    formData.append('time', moment().format('DD/MM/YYYY'));
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('incomplete', incomplete);
    const response = yield call(API.checkOut, {
      formData,
      authorization,
      shopId,
    });
    yield put(actions.onCheckOutResponse(response));
    yield put(loginActions.updateAuthorization(response.headers.authorization));
  } catch (error) {
    console.log('function*checkOut -> error', error);
    yield put(actions.checkOutFailed(error.message));
  }
}

export default function root() {
  return function* watch() {
    yield all([
      yield takeLatest(actionTypes.CHECK_IN_REQUEST, checkIn),
      yield takeLatest(actionTypes.CHECK_OUT_REQUEST, checkOut),
    ]);
  };
}
