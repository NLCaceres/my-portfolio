import React from "react";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
import UseOnMount from "../Utility/Hooks/UseOnMount";
import ContactPageForm from "./ContactPageForm";
import IndexCss from "./index.module.css";

//* Page with contact me form
//* If using an onMount func, will call it again IF no specific onUnmount given
const ContactPage = props => {
  const { onMount }  = props; //? Prop destructure preferred before using props in useEffect
  UseOnMount(onMount, null, true);
  
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