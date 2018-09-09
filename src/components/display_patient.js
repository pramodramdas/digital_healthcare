import React, { Component } from 'react';
import { getPatientInfoForDoctor } from '../utils/eth-util';
import { getFileInfo } from "../utils/eth-util";
import {  Icon, Card } from 'antd';
import { connect } from "react-redux";
import PopUp from "./common/popup";
import DisplayFiles from "./common/display_file";

class DisplayPatient extends Component {

    constructor(props){
        super(props);
    }

    state = {
        patient_name:"",
        patient_age:0,
        patient_files:[],
        filesInfo:[],
        showPopup:[],
    }

    componentWillMount() {
        if(this.props.patient_address)
            getPatientInfoForDoctor(this.props.patient_address, (data) => {
                this.setState({patient_name:data[0],patient_age:data[1].toNumber(),patient_files:data[3]},
                () => {
                    let  { patient_files } = this.state;
                    getFileInfo("doctor", patient_files, this.props.patient_address, (filesInfo) => {
                        this.setState({filesInfo});
                    });
                });
            });
    }

    showFile(hash, flag) {
        let { patient_files, showPopup } = this.state;
        if(patient_files.indexOf(hash) > -1){
            let showPopupTemp = showPopup.slice(0);
            showPopupTemp[patient_files.indexOf(hash)] = flag;
            this.setState({showPopup:showPopupTemp});
        }
    }

    render() {
        let { patient_address } = this.props;
        let { patient_name, patient_age, patient_files } = this.state;
        let { token } = this.props.auth;

        return(
            <div style={{width:"100%"}}>
                <Card bordered={true} style={flexStyle}>
                    <h4>patient address: {patient_address}</h4>
                    <h4> patien name: {patient_name}</h4>
                    <h4>patient age: {patient_age}</h4>
                </Card>
                <div style={{height: "500px", overflowY: "scroll"}}>
                    <Icon type="folder" /> 
                    {
                        patient_files.map((fhash, i) => {
                            let filename = this.state.filesInfo[i]?this.state.filesInfo[i][0]:null;
                            let diplayImage = "/ipfs_file?hash="+fhash+"&file_name="+filename+"&token="+token+"&patient_address="+this.props.patient_address;
                            // let diplayImage = "/ipfs_file?hash="+fhash+"&file_name="+filename+
                            // "&role=doctor&address="+web3.eth.accounts[0]+"&patient_address="+this.props.patient_address;
                            
                            let fileProps = {fhash, filename, diplayImage, i};
                            
                            return <DisplayFiles that={this} props={fileProps}/>
                        })
                    }
                </div>
            </div>
        );
    }
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

//export default DisplayPatient;
const mapStateToProps = (state) => {
    return {
      global_vars: state.global_vars,
      auth: state.auth
    };
};

//export default Home;
export default connect(mapStateToProps, {})(DisplayPatient);