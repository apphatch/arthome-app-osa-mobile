import { createSelector } from 'reselect';

const selectCheckInDomain = () => (state) => state.checkIn;

const makeSelectIsLoading = () =>
  createSelector(selectCheckInDomain(), (state) => state.isLoading);

const makeSelectIsCheckIn = () =>
  createSelector(selectCheckInDomain(), (state) => state.isCheckIn);

const makeSelectCheckInData = () =>
  createSelector(selectCheckInDomain(), (state) => state.checkInData);

export { makeSelectIsLoading, makeSelectIsCheckIn, makeSelectCheckInData };
