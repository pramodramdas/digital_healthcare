import React, { Component } from 'react';
import {  Button, message } from 'antd';
import { connect } from "react-redux";
import Doctor from "./doctor";
import Patient from "./patient";

class Home extends Component {

    constructor(props){
        super(props);
    }

    componentWillMount(){
        let { token } = this.props.auth;

        if(!token)
            this.props.history.push('/login');
    }

    render() {
        let { role } = this.props.auth;

        return (
            <div>
                {
                    (role === "doctor") ?
                    <Doctor /> :
                    <Patient />
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth
    };
};

//export default Home;
export default connect(mapStateToProps, {})(Home);