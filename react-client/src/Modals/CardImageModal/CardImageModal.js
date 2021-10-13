import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import cnames from "classnames";
import SimpleCarousel from "../../SimpleCarousel/SimpleCarousel";
import cardImgCss from "./CardImageModal.module.css";

const CardImgModal = props => {
  const project = props.project;
  let projectName;
  let projectImgs;
  let carousel;
  if (project) {
    projectName = project.title;
    projectImgs = project.post_images;
    carousel = (projectImgs.length > 1) ? //* Multiple imgs, then carousel
      (<SimpleCarousel images={projectImgs} viewWidth={props.viewWidth} />) :
      (projectImgs.length === 1) ? //* Single img or if no imgs than just null
        (<img src={ projectImgs[0].image_url } alt={ projectImgs[0].alt_text } 
          className={ cnames("img-fluid", cardImgCss.cardImg) } />) : null
  }
  return (
    <>
      <Modal isOpen={ props.isModalOpen } className="modal-dialog-centered"
        toggle={ () => { props.modalControl(null) }} >
          <ModalHeader toggle={ () => { props.modalControl(null) } }>
            { projectName }
          </ModalHeader>
          <ModalBody>{ carousel }</ModalBody>
      </Modal>
    </>
  );
};

export default CardImgModal;
