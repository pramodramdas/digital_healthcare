import React, { Component } from 'react';
import {  Button, message } from 'antd';
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { Layout } from 'antd';

const { Header } = Layout;

class CustomHeader extends Component {

    constructor(props){
        super(props);
    }

    // async registerDoctor(type) {
    //     let { healthRecord, web3 } = this.props.global_vars;
    //     let txn = await healthRecord.signupDoctor
    //     .sendTransaction("abc",{"from":web3.eth.accounts[0]});
        
    //     if(txn)
    //         message.success("registered successfully as doctor");
    //     else
    //         message.error("registered unsuccessfull");
    // }

    // async registerPatient() {
    //     let { healthRecord, web3 } = this.props.global_vars;
    //     let txn = await healthRecord.signupPatient
    //     .sendTransaction("def", 20 ,{"from":web3.eth.accounts[0]});
        
    //     if(txn)
    //         message.success("registered successfully as patient");
    //     else
    //         message.error("registered unsuccessfull");        
    // }

    componentDidMount() {
        let { token } = this.props.auth;
        
        if(!token)
            this.props.history.push('/login');
        else
            this.props.history.push('/home');
    }

    render() {
        let { token, name } = this.props.auth;
        
        return (
            <Header>
                <div style={{display:"flex", flexDirection:"row" ,justifyContent:"space-between"}}> 
                    {
                        token ? 
                        <div>
                            <h3 style={{color:"white"}}>Welcome {name}</h3>
                        </div>: ""
                    }
                    {
                        token ?
                        <div>
                            <Button type="primary" onClick={()=>{this.props.logout();this.props.history.push('./login');}} htmlType="submit" className="login-form-button">
                                Logout
                            </Button>
                        </div>:""
                    }
                </div>
            </Header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      global_vars: state.global_vars
    };
};

const actionCreators = {
    logout
}
//export default Header;
export default connect(mapStateToProps, actionCreators)(CustomHeader);