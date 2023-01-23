// import "./App.css";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import SimpleNavBar from "../SimpleNavbar/SimpleNavbar";
import PostListView from "../PostListView/PostListView.js";
import SimpleModal from "../Modals/SimpleModal.js";
import ContactPage from "../ContactMePage";
import ContactPageForm from "../ContactMePage/ContactPageForm";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import Footer from "../Footer/Footer";
import UnavailableFeatureAlert from "../Utility/Components/AlertUnavailableFeature";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
//import * as serviceWorker from "./serviceWorker";

const App = () => { //todo Add ReactRouter hooks in PostList & NotFoundPage probably
  const [width, setWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => { //? Use debounce to group all resize events into a single setWidth call
    const updateWidth = debounce(() => setWidth(window.innerWidth), 500); //? After 500ms passes w/out a new resize event
    window.addEventListener("resize", updateWidth) //? Throttle would let the width be updated every 500ms
    return () => { window.removeEventListener("resize", updateWidth) };
  }, []);

  const tempShowAlert = (shouldShow = true) => { //* Displays alert for 5 seconds BUT allows early dismissal
    setShowAlert(shouldShow);
    if (shouldShow) { setTimeout(() => setShowAlert(false), 5000) } //* Let dismiss after 5 seconds if no user interaction
  }

  const submitContactForm = (successful) => {
    setShowModal(false);
    tempShowAlert(); //todo Use following conditional call in the future or a more custom colored one based on success for better UX
    // if (process.env.REACT_APP_CONTACTABLE === 'false') { tempShowAlert() }
  }

  //* Prevent double redirects BUT on initial viewing redirect to /portfolio
  return (
    //? React-Router works in 3 parts, Router > Switch > Route/Redirect. You ALWAYS need those 3 parts, nested like so
    <BrowserRouter> 
      <SimpleNavBar viewWidth={ width } />
    
      <MainRoutes viewWidth={ width } />
      
      <UnavailableFeatureAlert show={ showAlert } setShow={ tempShowAlert } />
      
      <Footer viewWidth={ width } modalOpen={ () => setShowModal(true) }/>
      
      <SimpleModal ID="contact-me" show={ showModal } onHide={ () => setShowModal(false) } title="Send Me a Message!"
        headerClasses={`pt-2 pb-1`} titleClasses={`fw-bolder text-white`}>
          <ContactPageForm onSubmitForm={ submitContactForm } />
      </SimpleModal>
    </BrowserRouter>
  );
}

const MainRoutes = props => {
  const paths = ['iOS', 'android', 'front-end', 'back-end', 'about-me'];
  const mainRoutes = paths.map((pathStr) => {
    return (
      <Route exact path={`/portfolio/${pathStr}`} key={`/${pathStr}`} render={ routeProps =>
        (<PostListView viewWidth={ props.viewWidth } location={ routeProps.location } />) }
      />
    )
  });
  return (
    <Switch>
      { mainRoutes }
      
      <Route exact path="/contact-me" >
        <ContactPage viewWidth={props.viewWidth} />
      </Route>
      <Route exact path="/" render={() => <Redirect to="/portfolio/about-me" />} /> 
      {/*//* Need above 'home' route before the next redirect, or always get 404. Shows importance of order of routes/redirects */}

      <Route exact path="/not-found" component={ NotFoundPage } />  {/*//? Use component prop if routeProps need to be injected */}
      <Route render={() => <Redirect to="/not-found"/>} /> {/*//? Redirects placed last act as fallbacks */}
    </Switch>
  );
};

export default App;
