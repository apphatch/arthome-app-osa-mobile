import { httpClient } from '../../utils';
import { ENDPOINTS } from './constants';

export const fetchShops = ({ userId, token, authorization }) => {
  return httpClient.get(
    `${ENDPOINTS.shop}?user_id=${userId}`,
    {},
    {
      headers: { 'X-CSRF-Token': token, Authorization: authorization },
    },
  );
};
export const searchShops = ({ search = '', token, authorization }) => {
  return httpClient.get(
    `${ENDPOINTS.searchShop}${search}`,
    {},
    {
      headers: { 'X-CSRF-Token': token, Authorization: authorization },
    },
  );
};
