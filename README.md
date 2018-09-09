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

