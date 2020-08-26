import { createAction } from '../../utils';
import * as actionTypes from './actionTypes';

export const requestCheckIn = (data) =>
  createAction(actionTypes.CHECK_IN_REQUEST, { ...data });
export const onCheckInResponse = (response) =>
  createAction(actionTypes.CHECK_IN_RESPONSE, { ...response });

export const checkInFailed = () =>
  createAction(actionTypes.CHECK_IN_FAILED, {});

export const requestCheckOut = (data) =>
  createAction(actionTypes.CHECK_OUT_REQUEST, { ...data });
export const onCheckOutResponse = (response) =>
  createAction(actionTypes.CHECK_OUT_RESPONSE, { ...response });

export const checkOutFailed = () =>
  createAction(actionTypes.CHECK_OUT_FAILED, {});

export const reportResponse = (response) =>
  createAction(actionTypes.REPORT_RESPONSE, { ...response });

export const resetReport = () => createAction(actionTypes.RESET_REPORT, {});
