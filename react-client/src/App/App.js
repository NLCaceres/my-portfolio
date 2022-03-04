import throttle from "lodash/throttle";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
import "./App.css";
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

class App extends Component { //todo Should refactor App as func component to show Recaptcha via improved ReactRouter hooks
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      showModal: false,
      //todo If App is a func Component then can show recaptcha via ReactRouter hooks in specific routes
      showRecaptcha: false, 
      showAlert: false
    };

    this.recaptchaBadge = null //? Similar to React Ref pattern, store dom node here in instance prop rather than in state
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", throttle(this.updateWindowDimensions(), 500));
    window.addEventListener("load", this.setRecaptchaBadge);
    this.setRecaptchaBadge(); //* If already set, then no code run
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.setRecaptchaBadge);
    this.recaptchaBadge = null; //? Ref React pattern would usually handle nulling for us
    window.removeEventListener("resize", throttle(this.updateWindowDimensions(), 500));
  }

  setRecaptchaBadge = () => { //? Arrow Functions are an alternative to using bind() in ES6 classes
    if (!this.recaptchaBadge) {
      const recaptchaBadgeCheck = document.getElementsByClassName('grecaptcha-badge'); //* returns Array
      if (recaptchaBadgeCheck && recaptchaBadgeCheck.length > 0) {
        this.recaptchaBadge = recaptchaBadgeCheck[0]; //* Should have 1 recaptcha so checking 0 index so should avoid undefined issue
        if (window.location.pathname === '/contact-me') {
          this.recaptchaBadge.style.display = 'block'
          this.setState({ showRecaptcha: true });
        } else {
          this.recaptchaBadge.style.display = "none";
          this.setState({ showRecaptcha: false });
        }
      }
    }
  }
  showRecaptcha = (shouldShow) => {
    if (this.recaptchaBadge) {
      const showRecaptchaBadge = shouldShow ?? !this.state.showRecaptcha; //? Safe way to compute state based on prevState
      this.setState({ showRecaptcha: showRecaptchaBadge }); //? Do NOT compute state based on prevState in setState call
      if (showRecaptchaBadge) {
        this.recaptchaBadge.style.display = "block"
        //? Setting a CSS attr to "" removes the attr (if invalid) whereas 'auto' (the default)
        //? OR 'initial' may keep the attr and unintendedly style element
        this.recaptchaBadge.style['z-index'] = 1051 //? 1051 > 1050 for the modal z-index (so it's not shadowed)
      } else {
        this.recaptchaBadge.style.display = "none";
        this.recaptchaBadge.style['z-index'] = ""; 
      }
    }
  }

  updateWindowDimensions = () => { //? Using arrow funcs eliminates the need for bind
    return throttle(() => { this.setState({ width: window.innerWidth }) } );
  }

  modalOpen = (shouldShow = true) => { //* Called with false value by form submit method
    ConsoleLogger(`Opening modal ${shouldShow}`);
    this.showRecaptcha(shouldShow);
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
      //? React-Router works in 3 parts, Router > Switch > Route/Redirect. You ALWAYS need those 3 parts, nested like so
      <BrowserRouter> 
        <SimpleNavBar viewWidth={ this.state.width } />
      
        <MainRoutes viewWidth={ this.state.width } showRecaptcha={ this.showRecaptcha }/>
        
        <UnavailableFeatureAlert show={ this.state.showAlert } setShow={ this.showAlert} />
        
        <Footer viewWidth={ this.state.width } modalOpen={ () => this.modalOpen(true) }/>
        
        <SimpleModal ID="contact-me" show={ this.state.showModal } onHide={ () => this.modalOpen(false) } title="Send Me a Message!"
          headerClasses={`pt-2 pb-1`} titleClasses={`fw-bolder text-white`}>
            <ContactPageForm onSubmitForm={ this.submitContactForm } />
        </SimpleModal>
      </BrowserRouter>
    );
  }
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
        <ContactPage onMount={ props.showRecaptcha } viewWidth={props.viewWidth} />
      </Route>
      <Route exact path="/" render={() => <Redirect to="/portfolio/about-me" />} /> 
      {/*//* Need above 'home' route before the next redirect, or always get 404. Shows importance of order of routes/redirects */}

      <Route exact path="/not-found" component={ NotFoundPage } />  {/*//? Use component prop if routeProps need to be injected */}
      <Route render={() => <Redirect to="/not-found"/>} /> {/*//? Redirects placed last act as fallbacks */}
    </Switch>
  );
};

export default App;
