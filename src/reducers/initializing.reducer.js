import { INITIALIZE } from '../actions';

const initialState = true;

export default (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE:
      return false;
    default:
      return state;
  }
};
