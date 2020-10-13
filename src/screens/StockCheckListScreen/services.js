import { httpClient } from '../../utils';
import { API_ENDPOINTS } from './constants';

export const fetchCheckList = ({ shopId, authorization }) => {
  return httpClient.get(
    `checklists/index_by_user_shop?shop_id=${shopId}`,
    {},
    {
      headers: { Authorization: authorization },
    },
  );
};

export const submitCheckListItemData = ({ itemId, data, authorization }) => {
  return httpClient.post(`${API_ENDPOINTS.checkListItems}/${itemId}`, data, {
    headers: { Authorization: authorization },
  });
};

export const markDoneAll = ({ data, authorization, clId }) => {
  return httpClient.post(`checklists/${clId}/update_checklist_items`, data, {
    headers: { Authorization: authorization },
  });
};

export const fetchStockByCheckList = ({
  checkListId = 1,
  search = '',
  authorization,
}) => {
  return httpClient.get(
    `checklists/${checkListId}/search_checklist_items?search_term=${search}`,
    {},
    {
      headers: { Authorization: authorization },
    },
  );
};
