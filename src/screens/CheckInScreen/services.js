import { httpClient } from '../../utils';
import { ENDPOINTS } from './constants';

export const checkIn = ({ formData, token, authorization, shopId }) => {
  const endpoint = ENDPOINTS.checkIn(shopId);
  return httpClient.post(
    endpoint,
    { note: '', photo: '', time: '' },
    {
      headers: { 'X-CSRF-Token': token, Authorization: authorization },
    },
  );
};

export const checkOut = ({ formData, token, authorization, shopId }) => {
  const endpoint = ENDPOINTS.checkOut(shopId);
  return httpClient.post(endpoint, formData, {
    headers: { 'X-CSRF-Token': token, Authorization: authorization },
  });
};
