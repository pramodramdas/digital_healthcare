pragma solidity ^0.4.18;

import "./doctor.sol";
import "./patient.sol";
import "./file.sol";

contract HealthCare is Doctor, Patient, File {
    address private owner;
    
    function HealthCare() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier checkFileAccess(string role, address id, bytes32 fileHashId, address pat) {
        uint pos;
        if(keccak256(role) == keccak256("doctor")) {
            require(patientToDoctor[pat][id] > 0);
            pos = patientToFile[pat][fileHashId];
            require(pos > 0);   
        }
        else if(keccak256(role) == keccak256("patient")) {
            pos = patientToFile[id][fileHashId];
            require(pos > 0);
        }
        _; 
    }
    
    function checkProfile(address _user) public view onlyOwner returns(string, string){
        patient p = patients[_user];
        doctor d = doctors[_user];
          
        if(p.id > 0x0)
            return (p.name, 'patient');
        else if(d.id > 0x0)
            return (d.name, 'doctor');
        else
            return ('', '');
    }
  
    function grantAccessToDoctor(address doctor_id) public checkPatient(msg.sender) checkDoctor(doctor_id) {
        patient p = patients[msg.sender];
        doctor d = doctors[doctor_id];
        require(patientToDoctor[msg.sender][doctor_id] < 1);// this means doctor already been access
      
        uint pos = p.doctor_list.push(doctor_id);// new length of array

        patientToDoctor[msg.sender][doctor_id] = pos;
        d.patient_list.push(msg.sender);
    }
  
    function addFile(string _file_name, string _file_type, bytes32 _fileHash, string _file_secret) public checkPatient(msg.sender) {
        patient p = patients[msg.sender];

        require(patientToFile[msg.sender][_fileHash] < 1);
      
        hashToFile[_fileHash] = filesInfo({file_name:_file_name, file_type:_file_type,file_secret:_file_secret});
        uint pos = p.files.push(_fileHash);
        patientToFile[msg.sender][_fileHash] = pos;
    }
    
    function getPatientInfoForDoctor(address pat) public view checkPatient(pat) checkDoctor(msg.sender) returns(string, uint8, address, bytes32[]){
        patient p = patients[pat];

        require(patientToDoctor[pat][msg.sender] > 0);

        return (p.name, p.age, p.id, p.files);
    }
    
    function getFileSecret(bytes32 fileHashId, string role, address id, address pat) public view 
    checkFile(fileHashId) checkFileAccess(role, id, fileHashId, pat)
    returns(string) {
        filesInfo memory f = getFileInfo(fileHashId);
        return (f.file_secret);
    }

    function getFileInfoDoctor(address doc, address pat, bytes32 fileHashId) public view 
    onlyOwner checkPatient(pat) checkDoctor(doc) checkFileAccess("doctor", doc, fileHashId, pat)
    returns(string, string) {
        filesInfo memory f = getFileInfo(fileHashId);
        return (f.file_name, f.file_type);
    }
  
    function getFileInfoPatient(address pat, bytes32 fileHashId) public view 
    onlyOwner checkPatient(pat) checkFileAccess("patient", pat, fileHashId, pat) returns(string, string) {
        filesInfo memory f = getFileInfo(fileHashId);
        return (f.file_name, f.file_type);
    }
  
}