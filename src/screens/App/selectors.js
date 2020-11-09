import { createSelector } from 'reselect';

const selectAppDomain = () => (state) => state.app;

const makeSelectLocation = () =>
  createSelector(selectAppDomain(), (state) => state.location);

export { makeSelectLocation };
