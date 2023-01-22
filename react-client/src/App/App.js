import throttle from "lodash/throttle";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
// import "./App.css";
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

class App extends Component { //todo Should refactor App as func component to use improved ReactRouter hooks
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
  }

  componentWillUnmount() {
    window.removeEventListener("resize", throttle(this.updateWindowDimensions(), 500));
  }

  updateWindowDimensions = () => { //? Using arrow funcs eliminates the need for bind
    return throttle(() => { this.setState({ width: window.innerWidth }) } );
  }

  modalOpen = (shouldShow = true) => { //* Called with false value by form submit method
    ConsoleLogger(`Opening modal ${shouldShow}`);
    this.setState({ showModal: shouldShow });
  }

  showAlert = (shouldShow = true) => {
    this.setState({ showAlert: shouldShow });
    if (shouldShow) { //* If not dismissed by user, it'll dismiss itself
      let that = this; setTimeout(function() { that.setState({ showAlert: false }) }, 5000);
    }
  }

  submitContactForm = (successful) => {
    this.modalOpen(false);
    if (process.env.REACT_APP_CONTACTABLE === 'false') { this.showAlert() }
  }

  render() {
    //* Prevent double redirects BUT on initial viewing redirect to /portfolio
    return (
      //? React-Router works in 3 parts, Router > Switch > Route/Redirect. You ALWAYS need those 3 parts, nested like so
      <BrowserRouter> 
        <SimpleNavBar viewWidth={ this.state.width } />
      
        <MainRoutes viewWidth={ this.state.width } />
        
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
