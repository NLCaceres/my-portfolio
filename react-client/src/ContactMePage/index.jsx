import React from "react";
import ContactPageForm from "./ContactPageForm";
import IndexCss from "./index.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

//* Page with contact me form
const ContactPage = ({ viewWidth, onSubmitForm }) => {
  return (
    <div className={IndexCss['contact-page']}>
      <h1 className={`fw-normal ${(viewWidth > 768) ? 'display-3' : 'display-2'}`}>Contact Me!</h1>
      <div className={IndexCss['form-parent-container']}>
        <ContactPageForm darkMode onSubmitForm={onSubmitForm} />
      </div>
    </div>
  );
}

export default ContactPage;