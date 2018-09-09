import { SET_GLOBAL_DATA } from "./types";

export function set_global_data (content) {
    return {
      type: SET_GLOBAL_DATA,
      content
    };
}

export function setGlobalData (content) {
    return dispatch => {
        dispatch(set_global_data(content));
    }
}