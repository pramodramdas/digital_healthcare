pragma solidity ^0.4.18;


contract File {
    mapping (bytes32 => filesInfo) internal hashToFile;
    
    struct filesInfo {
        string file_name;
        string file_type;
        string file_secret;
    }

    modifier checkFile(bytes32 fileHashId) {
        bytes memory tempString = bytes(hashToFile[fileHashId].file_name);
        require(tempString.length > 0);//check if file exist
        _;
    }
    
    function getFileInfo(bytes32 fileHashId) internal view checkFile(fileHashId) returns(filesInfo) {
        return hashToFile[fileHashId];
    }
}