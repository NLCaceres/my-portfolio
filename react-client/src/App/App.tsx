import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useViewWidth, { ViewWidthProvider } from "../ContextProviders/ViewWidthProvider";
import AppAlert, { AlertState } from "../AppAlert/AppAlert";
import AppNavbar from "../AppNavbar/AppNavbar";
import ContactPageForm from "../ContactMePage/ContactPageForm";
import Footer from "../Footer/Footer";
import AppRouting from "../Routing/AppRouting";
import { SmoothScroll } from "../Utility/Functions/Browser";
import AppDialog from "../Modals/AppDialog";
import { type A11yDialogInstance } from "react-a11y-dialog";
//import * as serviceWorker from "./serviceWorker";


const Layout = () => {
  const width = useViewWidth();
  const [alertState, setShowAlert] = useState<AlertState>({ title: "", message: "", color: "" });

  //! App Alert Functionality
  const showAlertBriefly = (newState: AlertState) => { //* Displays alert for 5 seconds BUT allows early dismissal
    const alertTimeout = setTimeout(() => setShowAlert({ title: "", message: "", color: "" }), 5000); //* Auto-dismiss after 5 seconds
    setShowAlert({ ...newState, timeoutID: alertTimeout }); //* Set timeout so it can be cleared in case the user dismisses alert early
  };
  const closeAlert = () => {
    clearTimeout(alertState.timeoutID);
    //* AppAlert already hid itself BUT line 34 setShowAlert update causes 1 final (but mostly skipped) rerender,
    //* the alert remains hidden since its useEffect setShow() is skipped due to the value passed in not being actually changed/different
    setShowAlert({});
  };

  //! Contact Button Functionality
  const navigate = useNavigate();
  const dialog = useRef<A11yDialogInstance | undefined>();
  const showDialog = (show: boolean) => { show ? dialog.current?.show() : dialog.current?.hide(); };
  const contactButtonClicked = () => {
    if (width >= 576) {
      dialog.current?.show();
    }
    else {
      SmoothScroll();
      navigate("contact-me");
    }
  };
  //* This func has to handle the ContactForm Modal because it can't access RoutingContext since it's not rendered by an <Outlet />
  const submitContactForm = (successful: boolean) => {
    dialog.current?.hide();
    //! In the future, may need VITE_CONTACTABLE env var but currently ContactPageForm component handles it
    if (successful) { //* For better UX, this provides feedback on what happened with user's email message onSubmit
      showAlertBriefly({ color: "success", title: "Email sent!", message: "Successfully sent your message! I should get back to you soon!" });
    }
    else {
      showAlertBriefly({ color: "danger", title: "Sorry! Your email wasn't sent!",
        message: "Hopefully I'll have everything back up and running soon! In the mean time, enjoy the rest of my portfolio. Thanks!"
      });
    }
  };

  return (
    <>
      <AppNavbar />

      <AppRouting context={[showAlertBriefly, showDialog]} />

      <AppAlert title={ alertState.title } message={ alertState.message } color={ alertState.color } onClose={ closeAlert } />

      <Footer contactButtonOnClick={contactButtonClicked} />

      <AppDialog title="Send Me a Message!" dialogRef={dialog}><ContactPageForm onSubmitForm={submitContactForm} /></AppDialog>
    </>
  );
};

//? ContextProviders are only properly observed if they exist ABOVE the component calling useContext(), NOT the same level
const App = () => {
  return <ViewWidthProvider> <Layout /> </ViewWidthProvider>;
};

export default App;
