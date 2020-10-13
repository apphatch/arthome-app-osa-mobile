import { httpClient } from '../../utils';
import { ENDPOINTS } from './constants';

export const fetchShops = ({ userId, authorization }) => {
  return httpClient.get(
    `${ENDPOINTS.shop}?user_id=${userId}`,
    {},
    {
      headers: { Authorization: authorization },
    },
  );
};
export const searchShops = ({ search = '', authorization }) => {
  return httpClient.get(
    `${ENDPOINTS.searchShop}${search}`,
    {},
    {
      headers: { Authorization: authorization },
    },
  );
};
