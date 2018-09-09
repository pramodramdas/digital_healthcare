import axios from "axios";
import store from "../utils/store";
import { message } from "antd";
import { getBytes32FromIpfsHash } from "./ipfs-util";

export const updateFileHash = async (filename, type, fileHash, secret) => {
    let { web3, healthRecord } = store.getState().global_vars;
    // let res = await healthRecord.addFile
    // .sendTransaction(filename, type, hash , secret, {"from":web3.eth.accounts[0]});
    let res = await healthRecord.addFile
    .sendTransaction(filename, type, getBytes32FromIpfsHash(fileHash), secret, {"from":web3.eth.accounts[0]});
    
    if(res)
        message.success("file upload successful");
    else
        message.error("file upload unsuccessful");
}

export const getPatientInfoForDoctor = async (patient_address, callback) => {
    let { web3, healthRecord } = store.getState().global_vars;
    let res = await healthRecord.getPatientInfoForDoctor.call(patient_address);
    callback(res);
} 

export const getFileInfo = (role, file_list, patient_address, callback) => {
     let { web3 } = store.getState().global_vars;
    // let res = await healthRecord.getFileInfoPatient.sendTransaction(fileHash, {"from":web3.eth.accounts[0]});
    let body = {role, file_list, address: web3.eth.accounts[0], patient_address};
    axios.post('/files_info',body)
    .then((response) => {
        if(response.data)
            callback(response.data);
        else
            callback([]);
    });
}