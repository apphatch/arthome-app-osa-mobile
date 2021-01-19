import { createSelector } from 'reselect';

const selectAppDomain = () => (state) => state.app;

const makeSelectLocation = () =>
  createSelector(selectAppDomain(), (state) => state.location);

const makeSelectGranted = () =>
  createSelector(selectAppDomain(), (state) => state.granted);

const makeSelectServerTime = () =>
  createSelector(selectAppDomain(), (state) => state.serverTime);

export { makeSelectLocation, makeSelectGranted, makeSelectServerTime };
