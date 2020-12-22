import { createSelector } from 'reselect';

const selectLoginDomain = () => (state) => state.login;

const makeSelectIsLoading = () =>
  createSelector(selectLoginDomain(), (state) => state.isLoading);

const makeSelectIsLoggedIn = () =>
  createSelector(selectLoginDomain(), (state) => state.isLoggedIn);

const makeSelectAuthorization = () =>
  createSelector(selectLoginDomain(), (state) => state.authorization);

const makeSelectUserId = () =>
  createSelector(selectLoginDomain(), (state) => state.user_id);

const makeSelectAccount = () =>
  createSelector(selectLoginDomain(), (state) => state.account);
export {
  makeSelectIsLoading,
  makeSelectIsLoggedIn,
  makeSelectAuthorization,
  makeSelectUserId,
  makeSelectAccount,
};
