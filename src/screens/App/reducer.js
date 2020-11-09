import { createReducer } from '../../utils';
import * as actionTypes from './actionTypes';

const initialState = {
  location: null,
};

const handlers = {
  [actionTypes.SAVE_LOCATION]: saveLocation,
};

export default createReducer(initialState, handlers);

function saveLocation(state, action) {
  state.location = action.payload.location;
}
