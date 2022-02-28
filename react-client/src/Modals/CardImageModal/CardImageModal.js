import React from "react";
import SimpleModal from "../SimpleModal"
import SimpleCarousel from "../../SimpleCarousel/SimpleCarousel";
import { CleanAndKebabString } from "../../Utility/Functions/ComputedProps"; 

//@params: Props - project, viewWidth (to pass on), show (state of modal visibility), onHide (visibility callback)
const CardImageModal = props => {
  const { title: projectName, post_images: projectImgs } = props.project ?? {}; //* Use '??' to clearly handle null or undefined project case
  const kebabProjectName = (projectName) && CleanAndKebabString(projectName); //* If undefined projectName, kebabProjectName short circuits to undefined too
  
  return (
    <SimpleModal ID={kebabProjectName} title={projectName} show={ props.show } onHide={ props.onHide }
      headerClasses={`pt-2 pb-1`} titleClasses={`font-weight-bolder text-white`} bodyClasses={`pt-1`}>
        { (projectImgs && projectImgs.length > 1) && <SimpleCarousel images={projectImgs} viewWidth={props.viewWidth} /> }
    </SimpleModal>
  );
};

export default CardImageModal;
