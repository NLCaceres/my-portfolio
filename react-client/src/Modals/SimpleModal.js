import React, { Component } from "react";
import SimpleModalCss from "./SimpleModal.module.css";
import './SimpleModal.css';
import Modal from 'react-bootstrap/Modal';

class SimpleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Modal centered show={ this.props.show } onHide={ this.props.onHide }
        aria-labelledby={`${this.props.ID}-modal`} contentClassName={ SimpleModalCss.content }>
          { this.props.title && 
            <ModalHeader className={`${this.props.headerClasses}`} titleClasses={`${this.props.titleClasses}`}>
              { this.props.title }
            </ModalHeader> 
          }
          <Modal.Body>{ this.props.children }</Modal.Body>
          { this.props.footer && <ModalFooter className={`${this.props.footerClasses}`}>{this.props.footer}</ModalFooter> }
      </Modal>
    );
  }
}


const ModalHeader = props => {
  return (
    <Modal.Header closeButton className={`${props.className}`}>
      <Modal.Title id={`${props.ID}-modal`} className={`${props.titleClasses}`}>
        { props.children }
      </Modal.Title>
    </Modal.Header>
  )
}


const ModalFooter = props => {
  return (
    <Modal.Footer className={`${props.className}`}>
      { props.children }
    </Modal.Footer>
  )
}

export default SimpleModal;