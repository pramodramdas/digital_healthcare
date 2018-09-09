import axios from 'axios';
import store from './store';
import { set_auth_data } from '../actions/auth';

export const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    } else {
      delete axios.defaults.headers.common["token"];
    }
};

export const setUserData = (user) => {
    setAuthToken(user.token);
    localStorage.setItem("user",JSON.stringify(user));
}

export const loadUserData = () => {
    let user = localStorage.getItem("user");
    
    if(user) {
        let auth = JSON.parse(user);
      
        if(auth && auth.token) {
            setAuthToken(auth.token);
            store.dispatch(set_auth_data(auth));
        }
    }
}

// module.exports = {
//     setUserData,
//     setAuthToken,
//     loadUserData
// }