// import "./App.css";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
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

  //* Prevent double redirects BUT on initial viewing redirect to /portfolio
  return (
    //? React-Router works in 3 parts, Router > Switch > Route/Redirect. You ALWAYS need those 3 parts, nested like so
    <BrowserRouter> 
      <SimpleNavBar viewWidth={ width } />
    
      <RouteSwitch viewWidth={ width } />
      
      <AppAlert title={ alertState.title } message={ alertState.message } color={ alertState.color } onClose={ closeAlert } />
      
      <Footer viewWidth={ width } modalOpen={ () => setShowModal(true) }/>
      
      <SimpleModal ID="contact-me" show={ showModal } onHide={ () => setShowModal(false) } title="Send Me a Message!"
        headerClasses={`pt-2 pb-1`} titleClasses={`fw-bolder text-white`}>
          <ContactPageForm onSubmitForm={ submitContactForm } />
      </SimpleModal>
    </BrowserRouter>
  );
}

const RouteSwitch = ({viewWidth}) => {
  const paths = ['iOS', 'android', 'front-end', 'back-end', 'about-me'];
  return (
    <Switch>
      { paths.map((pathStr) => {
          return (
            <Route exact path={`/portfolio/${pathStr}`} key={`/${pathStr}`}> 
              <PostListView viewWidth={ viewWidth } />
            </Route>
          )
        })
      }
      
      <Route exact path="/contact-me" >
        <ContactPage viewWidth={ viewWidth } />
      </Route>
      <Route exact path="/" render={() => <Redirect to="/portfolio/about-me" />} /> {/*//* Preferred since v6 replaces <Redirect/> with <Navigate/> */}
      {/*//* Need above 'home' route before the next redirect, or always get 404. Shows importance of order of routes/redirects */}

      <Route exact path="/not-found" component={ NotFoundPage } />  {/*//? Use component prop if routeProps need to be injected */}
      <Route render={() => <Redirect to="/not-found"/>} /> {/*//? Redirects placed last act as fallbacks */}
    </Switch>
  );
};

export default App;
