const Web3 = require('web3');
const fs = require('fs');
//let web3 = new Web3();

class WebObj {
    constructor(){
        this.contract = {},
        this.healthCare = '';
        this.web3 = new Web3();
    }
    
    setProvider(provider){
        this.web3.setProvider(provider ? provider : new this.web3.providers.HttpProvider(process.env.HTTP_PROVIDER));
    }

    loadContract(){
        let source = fs.readFileSync("./build/contracts/HealthCare.json");
        this.contract = JSON.parse(source);
        let tempContract = this.web3.eth.contract(this.contract.abi);
        this.healthCare = tempContract.at(this.contract.networks[process.env.CONTRACT_DEPLOYED_PORT].address);
    }

    getWeb3(){
        return this.web3;
    }

    getHealthCare(){
        return this.healthCare;
    }
}

module.exports = WebObj;