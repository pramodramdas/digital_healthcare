import { SET_GLOBAL_DATA } from "../actions/types";

const INITIAL_STATE = {
};

export default (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case SET_GLOBAL_DATA:
      return {
        ...state,
        ...action.content
      };
    default:
      return state;
  }

}