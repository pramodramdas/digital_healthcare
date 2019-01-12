require('dotenv').config();
const ganache = require('ganache-cli');
const Web3 = require('web3');
const eutil = require('ethereumjs-util');
const axios = require('axios');
const HealthRecordContract = require('../build/contracts/HealthCare.json');
const ContractRef = require('./contract_ref');
const { init_web3 } = require('../server-utils/web3-util.js');
const { setAuthToken } = require('./test_helper');

//Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
const server = ganache.server();
const web3 = new Web3();
let app;

let { abi, bytecode } = HealthRecordContract;
let contractRef = new ContractRef();

beforeAll((done) => {
    console.log('Deploying contract.....');
    server.listen({port:7545,network_id:5783}, function(err, blockchain) {
        if(err)
            console.log(err);
        console.log('server started');

        web3.setProvider(new web3.providers.HttpProvider(process.env.HTTP_PROVIDER));

        web3.eth.getAccounts(async (error, accounts) => {
            if(error)
                console.log(error);

            contractRef.accounts = accounts;

            web3.eth.contract(JSON.parse(JSON.stringify(abi)))
            .new({from: accounts[0], gas: 4000000, data: bytecode}, (err, contract) => {
                if(err) {
                    console.log(err);
                    fail('contract deployment failed');
                }
    
                console.log('Contract deployed');
    
                if(contract.signupDoctor && accounts) {
                    contractRef.healthRecord = contract;
                    // console.log(contract);
                    contractRef.contractAddress = contract.address;
                    done();
                }
            });
        });
    });
});

describe('Check Registration', () => {

    beforeAll((done) => {
        console.log('Registering Doctor.....');
        contractRef.healthRecord.signupDoctor
        .sendTransaction('doctor1',{"from":contractRef.accounts[1], gas: 100000}, (err, txn) => {
            if(err) {
                console.log(err);
                fail('signup doctor failed');
            }
            else {
                console.log('doctor registration sucessful '+contractRef.accounts[1]);
                contractRef.doctors.push(contractRef.accounts[1]);
                done();
            }
        });
    });

    beforeAll((done) => {
        console.log('Registering Patient.....');
        contractRef.healthRecord.signupPatient
        .sendTransaction('patient1', 20, {"from":contractRef.accounts[2], gas: 100000}, (err, txn) => {
            if(err) {
                console.log(err);
                fail('signup patient failed');
            }
            else {
                console.log('patient registration sucessful '+ contractRef.accounts[2]);
                contractRef.patients.push(contractRef.accounts[2]);
                done();
            }
        });
    })

    test('Check doctor', (done) => {
        contractRef
        .healthRecord
        .getDoctorInfo
        .call({from: contractRef.accounts[1]}, (err, doc) => {
            if(err) {
                console.log(err);
                done.fail(err);
            }
            else {
                expect('doctor1').toEqual(doc[0]);
                done();
            }
        });
    });

    test('Check patient', (done) => {
        contractRef
        .healthRecord
        .getPatientInfo
        .call({from: contractRef.accounts[2]}, (err, pat) => {
            if(err) {
                console.log(err);
                done.fail(err);
            }
            else {
                expect('patient1').toEqual(pat[0]);
                done();
            }
        });
    });

});

// // Not able to proceed with test suit as sign function behaves differently.
// // signature extraction leads to different address.
describe('Check Signin', () => {
    beforeAll((done) => {
        process.env.CONTRACT_ADDRESS = contractRef.contractAddress;
        app = require('../server');
        init_web3();
        setTimeout(()=> {
            done();
        },5000)
    });

    test('Doctor signin', async (done) => {
        web3.eth.defaultAccount = contractRef.accounts[1];
        console.log(process.env.SERVER_ADDRESS+'/custom_auth/' + contractRef.accounts[1]);
        let resp = await axios.get(process.env.SERVER_ADDRESS+'/custom_auth/' + contractRef.accounts[1]);

        if(resp && resp.data){
            let signature = web3.eth.sign(contractRef.accounts[1], web3.sha3(resp.data.challenge), async (err, signature) => {
                if(err)
                    done.fail(err);

                let auth_resp = await axios.get(process.env.SERVER_ADDRESS+'/verify_auth/' + signature +"/?client_address="+web3.eth.defaultAccount);
                if (auth_resp.data && auth_resp.data.success) {
                    setAuthToken(auth_resp.data.user.token);
                    done()
                } else 
                    done.fail("login failed");
            });
        }
        else 
            done.fail("Erron in response");
    });

    afterAll(function () {
        app.close();
    });
 });