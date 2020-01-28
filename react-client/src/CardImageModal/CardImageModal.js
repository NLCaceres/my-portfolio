import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import cnames from "classnames";
import SimpleCarousel from "../SimpleCarousel/SimpleCarousel";
import cardImg from "./CardImageModal.module.css";
const util = require("util");

const CardImgModal = props => {
  const project = props.project;
  let projectName;
  let projectImgs;
  let carousel;
  if (project) {
    projectName = project.title;
    projectImgs = project.post_images;
    if (projectImgs.length > 1) {
      carousel = (
        <SimpleCarousel images={projectImgs} viewWidth={props.viewWidth} />
      );
    } else if (projectImgs.length === 1) {
      carousel = (
        <img
          src={projectImgs[0].image_url}
          alt={projectImgs[0].alt_text}
          className={cnames("img-fluid", cardImg.cardImg)}
        />
      );
    } else {
      carousel = null;
    }
  }
  return (
    <>
      <Modal
        isOpen={props.isModalOpen}
        toggle={() => {
          props.modalControl(null);
        }}
        className="modal-dialog-centered"
      >
        <ModalHeader
          toggle={() => {
            props.modalControl(null);
          }}
        >
          {projectName}
        </ModalHeader>
        <ModalBody>{carousel}</ModalBody>
      </Modal>
    </>
  );
};

export default CardImgModal;
