import AppModalCss from "./AppModal.module.css";
import Modal from "react-bootstrap/Modal";
import { CreateID } from "../Utility/Functions/ComputedProps";

let modalCount = 0;
const propIdOrModalId = id => {
  if (id === undefined) { //* Provide a default ID that should be unique
    let finalID;
    [modalCount, finalID] = CreateID(modalCount, "modal");
    return finalID;
  }
  return `${id}-modal`;
}

//* Probably an oversimplification of react-bootstrap's modal BUT works great!
//@params - Required: Show = Visibility prop, onHide = Callback prop, ID = aria-label
//@params Optional: contentClasses = modal-content section CSS class
//@params title = Like React children prop. Pass any string into Header > Title
//@params headerClasses = header section CSS class, titleClasses = title section CSS class
//@params bodyClasses = body section CSS class, footerClasses = footer section CSS class
//@params footer = Like React children prop. Pass any element or string into Footer
const AppModal = props => {
  const computedID = propIdOrModalId(props.ID);

  return (
    <Modal centered show={ props.show } onHide={ props.onHide } dialogClassName={`${AppModalCss.dialogBox}`}
      aria-labelledby={computedID} contentClassName={`${AppModalCss.content} ${props.contentClasses || ''}`.trim()}>
        { props.title && 
          <ModalHeader ID={ computedID } className={`${props.headerClasses || ''}`} titleClasses={`${props.titleClasses || ''}`}>
            { props.title }
          </ModalHeader> 
        }
        <Modal.Body className={`${props.bodyClasses || ''}`}>{ props.children }</Modal.Body>
        { props.footer && <ModalFooter className={`${props.footerClasses || ''}`}>{ props.footer }</ModalFooter> }
    </Modal>
  );
}

//@params headerClasses -> className, titleClasses -> titleClasses, ID -> ID
//@params title -> children = simple title string ideally
const ModalHeader = props => {
  return (
    <Modal.Header closeButton className={ props.className }>
      <Modal.Title as="h4" id={ props.ID } className={`fs-3 ${props.titleClasses}`}>
        { props.children }
      </Modal.Title>
    </Modal.Header>
  )
}

//@params footerClasses -> className, footer -> children = Any element or string
const ModalFooter = props => {
  return (
    <Modal.Footer className={ props.className }>
      { props.children }
    </Modal.Footer>
  )
}

export default AppModal;