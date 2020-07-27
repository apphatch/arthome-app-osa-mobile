import { httpClient } from '../../utils';
import { API_ENDPOINTS } from './constants';

export const fetchCheckList = ({ shopId, token, authorization }) => {
  return httpClient.get(
    `checklists/index_by_user_shop?shop_id=${shopId}`,
    {},
    {
      headers: { 'X-CSRF-Token': token, Authorization: authorization },
    },
  );
};

export const submitCheckListItemData = ({
  itemId,
  data,
  token,
  authorization,
}) => {
  return httpClient.post(`${API_ENDPOINTS.checkListItems}/${itemId}`, data, {
    headers: { 'X-CSRF-Token': token, Authorization: authorization },
  });
};

export const markDoneAll = ({ data, token, authorization, clId }) => {
  return httpClient.post(`checklists/${clId}/update_checklist_items`, data, {
    headers: { 'X-CSRF-Token': token, Authorization: authorization },
  });
};

export const fetchStockByCheckList = ({
  checkListId = 1,
  search = '',
  token,
  authorization,
}) => {
  return httpClient.get(
    `checklists/${checkListId}/search_checklist_items?search_term=${search}`,
    {},
    {
      headers: { 'X-CSRF-Token': token, Authorization: authorization },
    },
  );
};
