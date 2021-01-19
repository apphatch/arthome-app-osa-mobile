import { httpClient } from '../../utils';
import { ENDPOINTS } from './constants';

export const getServerTime = ({ authorization }) => {
  return httpClient.get(
    ENDPOINTS.getServerTime,
    {},
    {
      headers: { Authorization: authorization },
    },
  );
};
