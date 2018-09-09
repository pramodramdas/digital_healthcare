import bs58 from 'bs58'
import axios from 'axios';

export const getBytes32FromIpfsHash = (ipfsListing) => {
    return "0x"+bs58.decode(ipfsListing).slice(2).toString('hex')
}

// Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"

export const getIpfsHashFromBytes32 = (bytes32Hex) => {
    // Add our default ipfs values for first 2 bytes:
    // function:0x12=sha2, size:0x20=256 bits
    // and cut off leading "0x"
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
}

export const getFile = async (hash, callback) => {
    //console.log(getIpfsHashFromBytes32(hash));
    let res = await axios.get('/ipfs_file?hash='+hash+'&file_name=box-img-lg.png');
    
    if(res && res.data)
        callback(res.data);
    else
        callback("");
}