import { createAction } from '../../utils';
import * as actionTypes from './actionTypes';

export const requestShopPicture = (data) =>
  createAction(actionTypes.SHOP_PICTURE_REQUEST, { ...data });
export const onShopPictureResponse = (response) =>
  createAction(actionTypes.SHOP_PICTURE_RESPONSE, { ...response });

export const shopPictureFailed = (errorMessage) =>
  createAction(actionTypes.SHOP_PICTURE_FAILED, { errorMessage });

export const setError = (errorMessage) =>
  createAction(actionTypes.SET_ERROR, { errorMessage });
