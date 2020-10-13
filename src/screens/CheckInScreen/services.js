import { httpClient } from '../../utils';
import { ENDPOINTS } from './constants';

export const checkIn = ({ formData, authorization, shopId }) => {
  const endpoint = ENDPOINTS.checkIn(shopId);
  return httpClient.post(endpoint, formData, {
    headers: { Authorization: authorization },
  });
};

export const checkOut = ({ formData, authorization, shopId }) => {
  const endpoint = ENDPOINTS.checkOut(shopId);
  return httpClient.post(endpoint, formData, {
    headers: { Authorization: authorization },
  });
};
