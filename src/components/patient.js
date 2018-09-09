import React, { Component } from 'react';
import {  Button, Input, Upload, Icon, message, Row, Col, Tag, Card, Collapse } from 'antd';
import { connect } from "react-redux";
import { updateFileHash, getFileInfo } from "../utils/eth-util";
import DisplayFiles from "./common/display_file";

const Panel = Collapse.Panel;
const Dragger = Upload.Dragger;

class Patient extends Component {

    constructor(props){
        super(props);
        //this.onChange = this.onChange.bind(this);
    }

    state = {
        name: "",
        age: 0,
        files: [],
        doctor_list: [],
        filesInfo:[],
        showPopup:[],
        doctorId: null,
        secret: null,
        visible: false
    }

    componentDidMount(){
        let { healthRecord } = this.props.global_vars;
        
        if(healthRecord)
            this.loadPatient(healthRecord);
        
        this.fileProps.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps){
        let { healthRecord } = this.props.global_vars;
        if(healthRecord !== nextProps.global_vars.healthRecord) {
            this.loadPatient(nextProps.global_vars.healthRecord);   
        }
    }

    async loadPatient(healthRecord){
        let res = await healthRecord.getPatientInfo.call();

        this.setState({name:res[0],age:res[1].toNumber(),files:res[2],doctor_list:res[3]},
        () => {
            let  { files } = this.state;
            getFileInfo("patient", files, "", (filesInfo) => {
                this.setState({filesInfo});
            });
        });
    }

    async grantAccess(){
        let { healthRecord, web3 } = this.props.global_vars;
        
        if(this.state.doctorId){
            let res = await healthRecord.grantAccessToDoctor
            .sendTransaction(this.state.doctorId,{"from":web3.eth.accounts[0]});
            
            if(res) {
                message.success('access successful');
                this.setState({doctorId:null});
            }
        }
    }

    onTextChange(type, e){
        if(e && e.target)
            this.setState({[type]:e.target.value});
    }

    fileProps = {
        name: 'file',
        multiple: true,
        action: "/ipfs_upload",
        beforeUpload: (file, fileList) => {
            if(file.size > 5242880)// less than 5 MB
                return false
        },
        headers: {secret: this.state.secret},
        onChange: (info) => {
            //QmQpeUrxtQE5N2SVog1ZCxd7c7RN4fBNQu5aLwkk5RY9ER
            const status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if(info.file.response){
                    let { name, type, response } = info.file;

                    if(response) {
                        message.success('file uploaded successfully to ipfs');
                        console.log('secret '+this.state.secret);
                        updateFileHash(name, type, response, this.state.secret);
                    }
                    else
                        message.error("file upload unsuccessful");
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    // togglePopUp(flag) {
    //     this.setState({visible: flag});
    // }

    showFile(hash, flag) {
        let { files, showPopup } = this.state;
        if(files.indexOf(hash) > -1){
            let showPopupTemp = showPopup.slice(0);
            showPopupTemp[files.indexOf(hash)] = flag;
            this.setState({showPopup:showPopupTemp});
        }
    }

    render() {
        let { name, age, files, doctor_list } = this.state;
        let { web3 } = this.props.global_vars;
        let { token } = this.props.auth;
        this.fileProps.headers.secret = this.state.secret
        this.fileProps.onChange.bind(this);

        return (
            <div>
                <Row gutter={16} style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <Col className='col-3' span={6}>
                        <Card bordered={true} >
                            <div className='userDetails'  style={flexStyle}>
									<span>Name: {name}</span>
									<span>Age: {age}</span>
								
                            </div>
                        </Card>
                    </Col>
                    <Col className='col-3' span={6}>
                        <Card bordered={true}>
                            <div style={flexStyle}>
                                <Input className='emailId' style={{width:"100%"}} value={this.state.doctorId} onChange={this.onTextChange.bind(this, 'doctorId')} size="small" placeholder="Doctor Address"/>
                                <Button type="primary" onClick={this.grantAccess.bind(this)} htmlType="submit" className="login-form-button loginButton">
                                    Grant Access
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col className='col-3' span={6}>
                        <Card bordered={true}>
                            <Input className='emailId' style={{width:"100%"}} value={this.state.secret} onChange={this.onTextChange.bind(this, 'secret')} size="small" placeholder="One Time Secret"/>
                            <Dragger {...this.fileProps} disabled={this.state.secret?false:true}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Dragger>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Collapse className='folderTab' defaultActiveKey={['1']}>
                        <Panel   header={<Icon type="folder" />} key="1">
                            { 
                                files.map((fhash, i) => {
                                    let filename = this.state.filesInfo[i]?this.state.filesInfo[i][0]:null;
                                    //let diplayImage = "/ipfs_file?hash="+fhash+"&file_name="+filename;
                                    let diplayImage = "/ipfs_file?hash="+fhash+"&file_name="+filename+
                                    "&role=patient&token="+token+"&patient_address="+web3.eth.accounts[0];
                                    
                                    let fileProps = {fhash, filename, diplayImage, i};
                                    
                                    return <DisplayFiles that={this} props={fileProps}/>
                                }) 
                            }
                        </Panel>
                        <Panel header="Doctors List" key="2">
                            { 
                                doctor_list.map((doctor) => {
                                    return <Tag>{doctor}</Tag>
                                }) 
                            }
                        </Panel>
                    </Collapse>
                </Row>
            </div>
        );
    }
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      global_vars: state.global_vars,
    };
};

//export default Home;
export default connect(mapStateToProps, {})(Patient);