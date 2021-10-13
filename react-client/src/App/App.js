import throttle from "lodash.throttle";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
import "./App.css";
// import AppCss from "./App.module.css";
import React, { Component } from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import SimpleNavBar from "../SimpleNavbar/SimpleNavbar";
import PostListView from "../PostListView/PostListView.js";
import SimpleModal from "../Modals/SimpleModal.js";
import ContactPage from "../ContactMePage";
import ContactPageForm from "../ContactMePage/ContactPageForm";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import Footer from "../Footer/Footer";
import UnavailableFeatureAlert from "../Utility/Components/AlertUnavailableFeature";
//import * as serviceWorker from "./serviceWorker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      showModal: false,
      showAlert: false
    };

    this.recaptchaBadge = null //? Similar to React Ref pattern, store dom node here in instance prop rather than in state
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", throttle(this.updateWindowDimensions(), 500));
    window.addEventListener("load", this.setRecaptchaBadge);
  }  

  componentWillUnmount() {
    window.removeEventListener("load", this.setRecaptchaBadge);
    this.recaptchaBadge = null; //? Ref React pattern would usually handle nulling for us
    window.removeEventListener("resize", throttle(this.updateWindowDimensions(), 500));
  }

  setRecaptchaBadge = () => { //? Arrow Functions are an alternative to using bind() in ES6 classes
    if (!this.recaptchaBadge) { 
      this.recaptchaBadge = document.getElementsByClassName('grecaptcha-badge')[0];
      this.recaptchaBadge.style.display = "none";
    }
  }
  updateRecaptchaVisibility = (modalOpening) => {
    if (this.recaptchaBadge) {
      this.recaptchaBadge.style.display = (modalOpening) ? "block" : "none";
      //? Setting a CSS attr to "" removes the attr (if invalid) whereas 'auto' (the default)
      //? OR 'initial' may keep the attr and unintendedly style element
      this.recaptchaBadge.style['z-index'] = (modalOpening) ? 1050 : ""; //? 1050 matches modal z-index
    }
  }

  updateWindowDimensions = () => { //? Using arrow funcs eliminates the need for bind
    return throttle(() => { this.setState({ width: window.innerWidth }) } );
  }

  modalOpen = (shouldShow = true) => { //* Called with false value by form submit method
    ConsoleLogger(`Opening modal ${shouldShow}`);
    this.updateRecaptchaVisibility(shouldShow);
    this.setState({ showModal: shouldShow });
  }

  showAlert = (shouldShow = true) => {
    this.setState({ showAlert: shouldShow });
    if (shouldShow) { //* If not dismissed by user, it'll dismiss itself
      let that = this; setTimeout(function() { that.setState({ showAlert: false }) }, 5000);
    }
  }

  submitContactForm = (event) => {
    event.preventDefault(); event.stopPropagation(); //* Prevent page reload
    this.modalOpen(false);
    this.showAlert();
  }

  render() {
    //* Prevent double redirects BUT on initial viewing redirect to /portfolio
    return (
      <BrowserRouter>
        <Body viewWidth={ this.state.width } submitContactForm={ this.submitContactForm }
          showModal={ this.state.showModal } modalOpen={ this.modalOpen } showAlert={ this.state.showAlert } setShow={ this.showAlert } />
        {/* //? React-Router works in 3 parts, Router > Switch > Route/Redirect. You ALWAYS need those 3 parts, nested like so  */}
        <Switch>
          {/* //? If you place any regular components in a switch, it'll override any Routes/Redirects that come after it */}
          {/* //? Redirects NEED to be placed IN Switches same as Routes */}
          <Redirect exact from="/" to="/portfolio/about-me" />
          {/* //* Any redirects at basename='portfolio' level need to be handled there, any at root here */}
        </Switch>
      </BrowserRouter>
    );
  }
}

const Body = props => {
  return (
    <BrowserRouter basename="/portfolio">
      <SimpleNavBar viewWidth={ props.viewWidth } /> 
      
      <MainRoutes viewWidth={ props.viewWidth }/>
      
      <UnavailableFeatureAlert show={ props.showAlert } setShow={ props.setShow } />
      
      <Footer viewWidth={ props.viewWidth } modalOpen={ props.modalOpen }/>
      
      <SimpleModal ID="contact-me-modal" show={ props.showModal } onHide={ () => props.modalOpen(false) } title="Send Me a Message!"
        headerClasses={`pt-2 pb-1`} titleClasses={`font-weight-bolder`}>
          <ContactPageForm className={``} onSubmitForm={ props.submitContactForm }></ContactPageForm>
      </SimpleModal>
    </BrowserRouter>
  );
}

const MainRoutes = props => {
  const paths = ['iOS', 'android', 'front-end', 'back-end', 'about-me'];
  const mainRoutes = paths.map((pathStr) => {
    return (
      <Route exact path={`/${pathStr}`} key={`/${pathStr}`} render={ routeProps => 
        (<PostListView tabId={`${pathStr}`} viewWidth={ props.viewWidth } location={ routeProps.location } />) }
      />
    )
  });
  return (
    <Switch>
      { mainRoutes }
      
      <Route exact path="/contact-me" component={ ContactPage } />
      <Redirect exact from="/" to="/about-me" /> {/*//* Without this route before the next redirect, always end up at 404 */}

      <Route exact path="/not-found" component={ NotFoundPage } />
      <Redirect to="/not-found"/> {/* //? Redirects, if placed last, can be fallbacks just like Routes! */}
    </Switch>
  );
};

export default App;
