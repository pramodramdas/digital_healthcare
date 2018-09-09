import React, { Component } from 'react';
import HealthRecordContract from '../build/contracts/HealthCare.json';
import getWeb3 from './utils/getWeb3';
import {connect} from "react-redux";
import { setGlobalData } from './actions/global_vars';
import { logoutProxy } from './actions/auth';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/generic.css'
import './css/antd.css'
import './css/style.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      results.web3.eth.defaultAccount = results.web3.eth.accounts[0];
      this.props.setGlobalData({web3: results.web3});
      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract');
    const healthRecord = contract(HealthRecordContract);
    healthRecord.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    //let healthRecordInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      healthRecord.deployed().then((instance) => {
        //healthRecordInstance = instance;
        this.props.setGlobalData({healthRecord: instance});
        //console.log(healthRecordInstance);
      }).catch((err) => {
        console.log(err);
      });
    });
    // poll for account change, if account changes logout and reload page
    let account = this.state.web3.eth.accounts[0];
    let that = this;
    let checkAccountInterval = setInterval(function() {
      if (that.state.web3.eth.accounts[0] !== account) {
        account = that.state.web3.eth.accounts[0];
        logoutProxy();
        window.location.reload();
      }
    }, 500);
    //-----------------
  }

  render() {
    return (
        <div>
            {this.props.children}
        </div>
    );
  }
}

const actionCreators = {
  setGlobalData
};

export default connect(null, actionCreators)(App);