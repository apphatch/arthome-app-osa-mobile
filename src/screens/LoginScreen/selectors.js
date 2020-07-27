import { createSelector } from 'reselect';

const selectLoginDomain = () => (state) => state.login;

const makeSelectIsLoading = () =>
  createSelector(selectLoginDomain(), (state) => state.isLoading);

const makeSelectIsLoggedIn = () =>
  createSelector(selectLoginDomain(), (state) => state.isLoggedIn);

const makeSelectToken = () =>
  createSelector(selectLoginDomain(), (state) => state.token);

const makeSelectAuthorization = () =>
  createSelector(selectLoginDomain(), (state) => state.authorization);

const makeSelectUserId = () =>
  createSelector(selectLoginDomain(), (state) => state.user_id);

export {
  makeSelectIsLoading,
  makeSelectIsLoggedIn,
  makeSelectToken,
  makeSelectAuthorization,
  makeSelectUserId,
};
