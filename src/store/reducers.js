import { combineReducers } from 'redux';

import { appReducer } from '../screens/App';
import { loginReducer } from '../screens/LoginScreen';
import { shopReducer } from '../screens/ShopScreen';
// import { stockReducer } from '../screens/StockScreen';
import { stockCheckListReducer } from '../screens/StockCheckListScreen';
import { checkInReducer } from '../screens/CheckInScreen';
import { shopCaptureReducer } from '../screens/ShopCaptureScreen';

export default function createRootReducer() {
  return combineReducers({
    app: appReducer,
    login: loginReducer,
    shop: shopReducer,
    // stock: stockReducer,
    stockCheckList: stockCheckListReducer,
    checkIn: checkInReducer,
    shopCap: shopCaptureReducer,
  });
}
