import { createSelector } from 'reselect';

const selectAppDomain = () => (state) => state.app;

const makeSelectLocation = () =>
  createSelector(selectAppDomain(), (state) => state.location);

const makeSelectGranted = () =>
  createSelector(selectAppDomain(), (state) => state.granted);

export { makeSelectLocation, makeSelectGranted };
