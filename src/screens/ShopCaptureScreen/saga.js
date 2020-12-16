import { put, call, select, all, takeLatest, delay } from 'redux-saga/effects';
import UUIDGenerator from 'react-native-uuid-generator';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';

import * as actions from './actions';
import * as actionTypes from './actionTypes';

// ## API
import * as API from './services';

import {
  selectors as loginSelectors,
  actions as loginActions,
} from '../LoginScreen';

import { logger } from '../../utils';

export function* checkOut({ payload }) {
  const { note, photos, shopId, navigation } = payload;
  try {
    yield delay(0);
    const formData = new FormData();

    const authorization = yield select(
      loginSelectors.makeSelectAuthorization(),
    );

    for (let i = 0; i < photos.length; i++) {
      const element = photos[i];
      const photoName = yield UUIDGenerator.getRandomUUID();
      const photo = {
        uri: element.uri,
        type: 'image/jpeg',
        name: photoName,
      };
      formData.append('photos[]', photo);
    }
    formData.append('note', note);
    formData.append('time', moment().format('DD/MM/YYYY'));
    console.log(formData);

    const response = yield call(API.checkOut, {
      formData,
      authorization,
      shopId,
    });
    yield put(loginActions.updateAuthorization(response.headers.authorization));
    if (response?.data?.status === 'failed') {
      yield put(actions.shopPictureFailed('Gửi không thành công'));
    } else {
      yield put(
        actions.onShopPictureResponse({
          data: response.data,
        }),
      );
      navigation.dispatch(CommonActions.goBack());
    }
  } catch (error) {
    logger('function*login -> error', error);
    yield put(actions.shopPictureFailed('Gửi không thành công'));
  }
}

export default function root() {
  return function* watch() {
    yield all([yield takeLatest(actionTypes.SHOP_PICTURE_REQUEST, checkOut)]);
  };
}
