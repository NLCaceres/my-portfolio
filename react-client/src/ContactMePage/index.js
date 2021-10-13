import React from "react";
import ContactPageForm from "./ContactPageForm";
import IndexCss from "./index.module.css";

const ContactPage = props => {
  return (
    <div className="flex-grow-1" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
      <h1>Contact Me Page!</h1>
      <div className={`${ IndexCss['form-parent-container'] } py-2 px-3`}>
        <ContactPageForm darkMode />
      </div>
    </div>
  );
}

export default ContactPage;