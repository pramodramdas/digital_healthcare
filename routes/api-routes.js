const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: process.env.IPFS_HOST, port: process.env.IPFS_PORT, protocol: 'https' });
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const bs58 = require('bs58');
const { getWeb3Obj } = require("../server-utils/web3-util");
const { verify_token } = require("../server-controllers/auth-controller");

const getIpfsHashFromBytes32 = (bytes32Hex) => {
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
}

// var storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: function ( req, file, cb ) {
//         cb( null, 'QmQpeUrxtQE5N2SVog1ZCxd7c7RN4fBNQu5aLwkk5RY9ER'+file.originalname );
//     }
// });
// var upload = multer( { storage: storage } );

let upload  = multer({ storage: multer.memoryStorage() });

module.exports = (app) => {

    app.post('/ipfs_upload/', upload.single('file'), async (req, res)=>{
        let { secret } = req.headers;
        let cipher = crypto.createCipher('aes-256-ctr',secret)
        let crypted = Buffer.concat([cipher.update(req.file.buffer),cipher.final()]);

        try {
            let ipf_res = await ipfs.files.add(crypted); // Upload buffer to IPFS
            // console.log("encrypt "+secret);
            if(ipf_res && ipf_res[0]) {
                let url = `https://ipfs.io/ipfs/${ipf_res[0].hash}`
                console.log(`Url --> ${url}`);
                res.send(ipf_res[0].hash);//QmdSbx8C2zAQm6N3cSUoQdF7AhHaBE6eVHA4UrbUvF1mjD
            }
            else {
                console.log("ipf upload error.....");
                res.send("");
            }
            //res.send('QmdSbx8C2zAQm6N3cSUoQdF7AhHaBE6eVHA4UrbUvF1mjD');
        }
        catch(error) {
            console.log(error);
            res.send("");
        }
       //res.send(req.file.filename);
    });

    app.get('/ipfs_file', verify_token, async (req, res)=>{
        const { role , client_address } = res.locals.decoded;
        const { file_name, hash, patient_address } = req.query;
        const ipf_res = await ipfs.files.get(getIpfsHashFromBytes32(hash));

        try {
            if(ipf_res && ipf_res[0]) {
                // console.log(ipf_res[0].path)
                // console.log(ipf_res[0].content.toString('utf8'));
                const content = ipf_res[0].content;
                const secret = await getWeb3Obj().getHealthCare().getFileSecret(hash, role, client_address, patient_address);
                //const secret = await getWeb3Obj().getHealthCare().getFileSecret.sendTransaction(hash, role, client_address, patient_address,{"from":getWeb3Obj().getWeb3().eth.accounts[0]});
                // console.log("decrypt "+secret);
                const decipher = crypto.createDecipher('aes-256-ctr',secret);
                const dec = Buffer.concat([decipher.update(content) , decipher.final()]);
                res.end(dec, 'binary');
            }
            else {
                console.log("ipf fetch error.....");
                res.send("error");
            }
        }
        catch(error) {
            console.log(error);
            res.send("error");
        }
    });

    app.post('/files_info', verify_token, (req, res)=>{
        const { role , client_address } = res.locals.decoded;
        const { patient_address, file_list } = req.body;
        //const { patient_address, address, file_list, role } = req.body;
        let fetchFileInfo;
        if(role == "doctor") {
            fetchFileInfo = file_list.map(async (fileHash) => {
                // console.log(fileHash);
                return await getWeb3Obj().getHealthCare().getFileInfoDoctor(client_address,patient_address,fileHash);
            });
            Promise.all(fetchFileInfo).then((result) => {
                res.send(result);
            });
        }
        else if(role == "patient"){
            fetchFileInfo = file_list.map(async (fileHash) => {
                return await getWeb3Obj().getHealthCare().getFileInfoPatient(client_address,fileHash);
            });
            Promise.all(fetchFileInfo).then((result) => {
                // console.log(result);
                res.send(result);
            }).catch((err) => {
                console.log("errrrrror.....");
                console.log(err);
            });
        }
        else
        res.send([]);
    });
}