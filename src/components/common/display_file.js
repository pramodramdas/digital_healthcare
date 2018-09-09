import React from 'react';
import {  Button, Card, Icon } from 'antd';
import PopUp from "./popup";

const display_file = ({that, props}) => {
    let {fhash, filename, diplayImage, i} = props;
    return(
        <div>
            <Card title={filename} bordered={true}>
                <h4>filehash: {fhash}</h4>
                <h4>filetype: {that.state.filesInfo[i]?that.state.filesInfo[i][1]:null}</h4>
                <Button type="primary" onClick={that.showFile.bind(that, fhash, true)}><Icon type="file" />Show File</Button>
                <PopUp showPopup={that.state.showPopup[i]} closePopup={that.showFile.bind(that, fhash, false)}>
                    <img src={diplayImage} />
                </PopUp>
            </Card>
        </div>
    );
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

export default display_file;