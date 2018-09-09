import {combineReducers} from "redux";
import auth from "./auth";
import global_vars from "./global_vars";

const rootReducer = combineReducers({
    auth,
    global_vars
});

export default rootReducer;