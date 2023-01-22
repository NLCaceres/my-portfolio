import React from "react";
import UseOnMount from "../Utility/Hooks/UseOnMount";
import ContactPageForm from "./ContactPageForm";
import IndexCss from "./index.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

//* Page with contact me form
//* If using an onMount func, will call it again IF no specific onUnmount given
const ContactPage = props => {
  const { onMount, viewWidth }  = props; //? Prop destructure preferred before using props in useEffect
  UseOnMount(onMount, null, true);
  
  return (
    <div className={`flex-grow-1 ${IndexCss['contact-page']}`}>
      <h1 className={`fw-normal ${(viewWidth > 768) ? 'display-3' : 'display-2'}`}>Contact Me Page!</h1>
      <div className={`${ IndexCss['form-parent-container'] } py-2 px-3`}>
        <ContactPageForm darkMode />
      </div>
    </div>
  );
}

export default ContactPage;