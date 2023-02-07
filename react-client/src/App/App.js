// import "./App.css";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SimpleNavBar from "../SimpleNavbar/SimpleNavbar";
import PostListView from "../PostListView/PostListView.js";
import SimpleModal from "../Modals/SimpleModal.js";
import ContactPage from "../ContactMePage";
import ContactPageForm from "../ContactMePage/ContactPageForm";
import AppAlert from "../Utility/Components/AppAlert";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import Footer from "../Footer/Footer";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
//import * as serviceWorker from "./serviceWorker";

const App = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);
  const [alertState, setShowAlert] = useState({}); //? { title: string, message: string, color: string, timeout: int (ID) }
  useEffect(() => { //? Use debounce to group all resize events into a single setWidth call
    const updateWidth = debounce(() => setWidth(window.innerWidth), 500); //? After 500ms passes w/out a new resize event
    window.addEventListener("resize", updateWidth) //? Throttle would let the width be updated every 500ms
    return () => { window.removeEventListener("resize", updateWidth) };
  }, []);

  //! App Alert Functionality
  const showAlertBriefly = (newState) => { //* Displays alert for 5 seconds BUT allows early dismissal
    const alertTimeout = setTimeout(() => setShowAlert({}), 5000) //* Auto-dismiss after 5 seconds
    setShowAlert({ ...newState, timeout: alertTimeout }); //* Set timeout so it can be cleared in case the user dismisses alert early
  }
  const closeAlert = () => {
    clearTimeout(alertState.timeout);
    //* AppAlert already hid itself BUT line 34 setShowAlert update causes 1 final (but mostly skipped) rerender, 
    //* the alert remains hidden since its useEffect setShow() is skipped due to the value passed in not being actually changed/different
    setShowAlert({});
  }

  //! Contact Button Functionality
  const navigate = useNavigate();
  const contactButtonClicked = () => {
    if (width >= 576) { setShowModal(true) }
    else { navigate("contact-me") }
  }
  const submitContactForm = (successful) => {
    setShowModal(false);
    //! In the future, may need REACT_APP_CONTACTABLE env var but currently ContactPageForm component handles it
    if (successful) { //* For better UX, this provides feedback on what happened with user's email message onSubmit
      showAlertBriefly({ color: "success", title: "Email sent!", message: "Successfully sent your message! I should get back to you soon!" });
    }
    else {
      showAlertBriefly({ color: "danger", title: "Sorry! Your email wasn't sent!",
        message: "Hopefully I'll have everything back up and running soon! In the mean time, enjoy the rest of my portfolio. Thanks!" 
      });
    }
  }

  return (
    <> 
      <SimpleNavBar />
    
      <AppRouting viewWidth={ width } submitContactForm={submitContactForm} />
      
      <AppAlert title={ alertState.title } message={ alertState.message } color={ alertState.color } onClose={ closeAlert } />
      
      <Footer contactButtonOnClick={contactButtonClicked} />
      
      <SimpleModal ID="contact-me" show={ showModal } onHide={ () => setShowModal(false) } title="Send Me a Message!"
        headerClasses="pt-2 pb-1" titleClasses="fw-bolder text-white">
          <ContactPageForm onSubmitForm={ submitContactForm } />
      </SimpleModal>
    </>
  );
}

const AppRouting = ({ viewWidth, submitContactForm }) => {
  const paths = ['iOS', 'android', 'front-end', 'back-end', 'about-me'];
  return ( //? 'Routes' must exist nested in a Router somewhere upstream. <Route /> must exist nested in a 'Routes' somewhere upstream
    //? This ensures simple relative pathways where the base 'Routes' = "/" and all 'Routes' inside a <Route path="user"> takes on the prefix "/user"
    <Routes>
      { paths.map((pathStr) => { //? Route component dropped 'exact' prop + uses 'element' prop instead of 'children' or 'render' prop for components
          return <Route path={`portfolio/${pathStr}`} key={pathStr} element={<PostListView viewWidth={ viewWidth } />} /> 
        })
      }
      
      <Route path="contact-me" element={<ContactPage viewWidth={ viewWidth } onSubmitForm={ submitContactForm } />} />
      {/*//? 'path' doesn't require leading slash except in the Home: "/" path */}
      <Route path="/" element={<Navigate to="portfolio/about-me" replace />} /> {/*//? Navigate w/ 'replace' replicates old Redirect functionality */}
      {/*//* Need above 'home' route before the next Navigate, or always get 404, highlights the importance of order of routes */}

      <Route path="not-found" element={ <NotFoundPage /> } /> {/*//? Used for following wildcard "*" fallback route */}
      <Route path="*" element={<Navigate to="not-found" replace/>} /> {/*//? Navigate runs a useEffect to nav to "/not-found" */}
    </Routes>
  );
};

export default App;
