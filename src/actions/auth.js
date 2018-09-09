import axios from "axios";
import { SET_AUTH_DATA } from "./types";
import { setAuthToken } from "../utils/auth-util";
import store from "../utils/store";

export function set_auth_data(content) {
    return {
      type: SET_AUTH_DATA,
      content
    };
}

export function setAuthData(content) {
    return dispatch => {
        dispatch(set_auth_data(content))
    }
}

export function logout() {
    return dispatch => {
        dispatch(set_auth_data({name:"",token:"",role:""}));
        setAuthToken();
        localStorage.setItem('user',null);
    }
}

export function logoutProxy() {
    logout()(store.dispatch);
}

export async function verify_token() {
    let res = await axios.head('/verify_token');
    
    if(!(res && (res.headers.success === "true")))
        logoutProxy()//logout()(store.dispatch);
}