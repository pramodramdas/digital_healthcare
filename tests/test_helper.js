import axios from 'axios';

const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    } else {
      delete axios.defaults.headers.common["token"];
    }
};

module.exports = {
    setAuthToken
}