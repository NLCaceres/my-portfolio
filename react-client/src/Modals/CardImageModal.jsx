import React from "react";
import AppModal from "./AppModal"
import AppCarousel from "../AppCarousel/AppCarousel";
import { CleanAndKebabString } from "../Utility/Functions/ComputedProps"; 

//@params: Props - project, viewWidth (to pass on), show (state of modal visibility), onHide (visibility callback)
const CardImageModal = props => {
  const { title: projectName, post_images: projectImgs } = props.project ?? {}; //* Use '??' to clearly handle null or undefined project case
  const kebabProjectName = (projectName) && CleanAndKebabString(projectName); //* If undefined projectName, kebabProjectName short circuits to undefined too
  
  return (
    <AppModal ID={kebabProjectName} title={projectName} show={ props.show } onHide={ props.onHide }
      headerClasses={`pt-2 pb-1`} titleClasses={`fw-bolder text-white`} bodyClasses={`pt-1`}>
        { (projectImgs && projectImgs.length > 1) && <AppCarousel images={projectImgs} viewWidth={props.viewWidth} className='px-4 mt-3' /> }
    </AppModal>
  );
};

export default CardImageModal;
