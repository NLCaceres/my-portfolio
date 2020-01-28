import logo from "../logo.svg";
import "./App.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SimpleNavBar from "../SimpleNavbar/SimpleNavbar";
import PostListView from "../PostListView/PostListView.js";
import throttle from "lodash.throttle";
//import * as serviceWorker from "./serviceWorker";

class App extends Component {
  constructor(props) {
    super(props);
    this.openTab = this.openTab.bind(this);
    this.state = {
      width: window.innerWidth
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener(
      "resize",
      throttle(this.updateWindowDimensions(), 500)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      throttle(this.updateWindowDimensions(), 500)
    );
  }

  updateWindowDimensions() {
    return throttle(() => {
      this.setState({ width: window.innerWidth });
    });
  }

  openTab(tab) {
    console.log(`Open tab called`);
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <BrowserRouter basename="/resume-react">
        <SimpleNavBar openTab={this.openTab} viewWidth={this.state.width} />
        <Switch>
          <Route
            exact
            path="/"
            render={routeProps => (
              <PostListView
                tabId="About Me!"
                viewWidth={this.state.width}
                location={routeProps.location}
              />
            )}
          />
          <Route
            exact
            path="/iOS"
            render={routeProps => (
              <PostListView
                tabId="iOS"
                viewWidth={this.state.width}
                location={routeProps.location}
              />
            )}
          />
          <Route
            exact
            path="/android"
            render={routeProps => (
              <PostListView
                tabId="Android"
                viewWidth={this.state.width}
                location={routeProps.location}
              />
            )}
          />
          <Route
            exact
            path="/front-end"
            render={routeProps => (
              <PostListView
                tabId="Front-End"
                viewWidth={this.state.width}
                location={routeProps.location}
              />
            )}
          />
          <Route
            exact
            path="/back-end"
            render={routeProps => (
              <PostListView
                tabId="Back-End"
                viewWidth={this.state.width}
                location={routeProps.location}
              />
            )}
          />
          <Route component={NoMatchFoundPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const NoMatchFoundPage = () => {
  const randomImgSet = [
    "https://imgur.com/uclpvfT.png",
    "https://imgur.com/lNcHO0e.png",
    "https://imgur.com/Of0gAOd.png",
    "https://imgur.com/2EEuwzP.png",
    "https://imgur.com/wkdXneC.png",
    "https://imgur.com/DnGZrfn.png",
    "https://imgur.com/UYxIDEk.png",
    "https://imgur.com/KXnbSAi.png",
    "https://imgur.com/Ow4Vn9x.png"
  ];
  const rand = Math.floor(Math.random() * 9);
  const imgSrc = randomImgSet[rand];
  console.log(rand);
  return (
    <div>
      <h1>Sorry Not Much to See Here!</h1>
      <img src={imgSrc} className="not-found-img" />
      <h4>So Here's a Puppy to Make Up for It!</h4>
    </div>
  );
};

export default App;
