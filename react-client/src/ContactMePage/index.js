import React from "react";
import ContactPageForm from "./ContactPageForm";
import IndexCss from "./index.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

//* Page with contact me form
const ContactPage = ({ viewWidth }) => {
  
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