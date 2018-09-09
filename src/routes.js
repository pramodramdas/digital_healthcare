import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from "axios";
import IndexComponent from './index-component';
import { loadUserData } from './utils/auth-util';
import { verify_token, logout } from "./actions/auth";
import store from "./utils/store";

loadUserData();

const getConfirmation = (message, callback) => {
    verify_token();
    callback(true);
}

axios.interceptors.response.use(
    response => {
        return response;
    }, error => {
        if (error.response && error.response.status === 403) {
            logout()(store.dispatch);
            window.location.href = '/login';
        }
    }
);

const Routes = () => {
    return (
        <BrowserRouter getUserConfirmation={getConfirmation}>
            <Route path="/" component={IndexComponent} />
        </BrowserRouter>
    );
};

export default Routes;