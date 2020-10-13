import { httpClient } from '../../utils';
import { ENDPOINTS } from './constants';

export const checkOut = ({ formData, authorization, shopId }) => {
  return httpClient.post(ENDPOINTS.checkOut(shopId), formData, {
    headers: { Authorization: authorization },
  });
};
