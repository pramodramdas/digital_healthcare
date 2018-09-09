# digital_healthcare
electronic health records on blockchain

### Summary
Project stores patient records on blockchain(hybrid). Hybrid because files are not stored on blockchain, but access information is stored on blockchain. There will be two participants doctor and patient.  
- Doctor register by providing name.  
- Patient register by providing name and age.
- Patient uploads files and provides random nounce to encrypt the file, file will be uploaded to IPFS and secret is stored in ethereum.
- Patient provides access to particular doctor.
- Once doctor is given access by patient, he will be able to see patient's address in his home page.
- Doctor can get all files ipfs hash of patient and send request to node app for file view.
- Node app will fetch file from ipfs and get secret from blockchain, decrypt file and send it to doctor.

### Note
Code has been tested only with ganache, not with any testnet.

### Project setup
HTTP_PROVIDER = provider url ex: http://127.0.0.1:7545  
IPFS_HOST = currently infura (can be changed to local node as well)

**1. Start Ganache**  
&nbsp;&nbsp;&nbsp;Contract can be deployed to any network, In my case ganache.
Update CONTRACT_DEPLOYED_PORT in env, which can be found in build -> contracts -> HealthCare.json -> "networks".  

**2. Start react server**  
&nbsp;&nbsp;&nbsp;`npm run start`  

**3. Start node app**   
&nbsp;&nbsp;&nbsp;`npm run server`  

**4. Connect metamask to ganache and Import ganache accounts to metamask**  
&nbsp;&nbsp;&nbsp;ex: http://localhost:7545  

