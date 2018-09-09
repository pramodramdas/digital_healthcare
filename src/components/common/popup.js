import React from 'react';
import { Modal, Button } from 'antd';

class PopUp extends React.Component {
  
  state = { visible: (this.props.showPopup ? true : false) }

  componentWillReceiveProps(nextProps){
    if(this.props.showPopup !== nextProps.showPopup)
        this.setState({visible: nextProps.showPopup});
  }

  handleOk = (e) => {
    console.log(e);
    if(this.props.closePopup)
        this.props.closePopup();
    else
        this.setState({visible: false});
  }

  handleCancel = (e) => {
    console.log(e);
    if(this.props.closePopup)
        this.props.closePopup();
    else
        this.setState({visible: false});
  }

  render() {
    return (
      <div >
        <Modal className='popupWindow'
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            {this.props.children}
        </Modal>
      </div>
    );
  }
}

export default PopUp;