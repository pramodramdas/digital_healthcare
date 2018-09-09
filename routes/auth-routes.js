const cache = require("memory-cache");
const crypto = require('crypto');
const eutil = require('ethereumjs-util');
const { fetchUserProfile } = require("../server-controllers/api-controller");
const { encode_jwt } = require("../server-utils/jwt-util");
const { getWeb3Obj } = require("../server-utils/web3-util");
const { verify_token } = require("../server-controllers/auth-controller");

module.exports = (app, metaAuth) =>{
    app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
        res.send(req.metaAuth.challenge);
    });

    app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
        if (req.metaAuth.recovered) {
            fetchUserProfile(req.metaAuth.recovered, (err, profile) => {
                let user = {
                    name: profile[0],
                    role: profile[1],
                }
                user.token = encode_jwt(Object.assign({},user,{id:req.metaAuth.recovered}));
                res.send({"success":true, user});
            });
        } else {
            res.status(500).send();
        };
    });

    app.get('/custom_auth/:MetaAddress', (req, res) => {
        let web3 =  getWeb3Obj().getWeb3();
        let { MetaAddress } = req.params;

        if(MetaAddress && web3.isAddress(MetaAddress)){
            try {
                crypto.randomBytes(48, function(err, buffer) {
                    var challenge = buffer.toString('hex');
                    cache.put(MetaAddress, challenge, 60000);// one minute
                    res.json({challenge, success:true});
                });
            }
            catch(e){
                res.json({success:false, msg:"error"});
            }
        }
        else {
            res.json({success:false, msg:"invalid or missing address"});
        }
    });

    app.get('/verify_auth/:signature', (req, res) => {
        let { client_address } = req.query;
        let challange = cache.get(client_address);

        if(req.params.signature && challange) {
            const sig = eutil.fromRpcSig(req.params.signature);
            const publicKey = eutil.ecrecover(eutil.sha3(challange), sig.v, sig.r, sig.s);
            const address = eutil.pubToAddress(publicKey).toString('hex');

            if(('0x'+address) === client_address) {
                fetchUserProfile(client_address, (err, profile) => {
                    let user = {
                        name: profile[0],
                        role: profile[1],
                    }
                    user.token = encode_jwt(Object.assign({},user,{client_address}));
                    res.send({"success":true, user});
                });
            }
            else {
                res.status(500).send();
            }
        }
        else {
            res.status(500).send();
        }
    });

    app.head('/verify_token/', verify_token, (req, res) => { 
        res.writeHead(200, {'success': true});
        res.end();
    });
}