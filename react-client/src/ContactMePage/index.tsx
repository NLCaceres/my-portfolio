import ContactPageForm from "./ContactPageForm";
import IndexCss from "./index.module.css";
import useViewWidth from "../ContextProviders/ViewWidthProvider";
import { useRoutingContext } from "../Routing/AppRouting";

//* Page with contact me form
const ContactPage = () => {
  //todo Is submitForm() needed? Or does it provide better UX by showing the Alert?
  const showAlert = useRoutingContext()[1];
  const submitContactForm = (successful: boolean) => {
    if (successful) {
      showAlert({ color: "success", title: "Email sent!", message: "Successfully sent your message! I should get back to you soon!" });
    }
    else {
      showAlert({ color: "danger", title: "Sorry! Your email wasn't sent!",
        message: "Hopefully I'll have everything back up and running soon! In the mean time, enjoy the rest of my portfolio. Thanks!" 
      });
    }
  }
  const viewWidth = useViewWidth();
  
  return (
    <div className={IndexCss["contact-page"]}>
      <h1 className={`fw-normal ${(viewWidth > 768) ? "display-3" : "display-2"}`}>Contact Me!</h1>
      <div className={IndexCss["form-parent-container"]}>
        <ContactPageForm onSubmitForm={submitContactForm} darkMode />
      </div>
    </div>
  );
}

export default ContactPage;