import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarToggler,
  Collapse
} from "reactstrap";
import cnames from "classnames";
import navbar from "./Navbar.module.css";

class SimpleNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <>
        <Navbar
          className={cnames(navbar.header, "sticky-top")}
          light
          expand="md"
        >
          <NavContents
            toggleFunc={this.toggle}
            openTab={this.props.openTab}
            isOpened={this.state.isOpen}
            activeTab={this.props.activeTab}
            viewWidth={this.props.viewWidth}
          />
        </Navbar>
      </>
    );
  }
}

const NavContents = props => {
  return (
    <>
      <NavbarToggler onClick={props.toggleFunc} />
      {props.viewWidth < 768 ? (
        <MobileNav
          isOpened={props.isOpened}
          openTab={props.openTab}
          activeTab={props.activeTab}
          viewWidth={props.viewWidth}
          collapseNav={props.toggleFunc}
        />
      ) : (
        <FullNav
          isOpened={props.isOpened}
          openTab={props.openTab}
          activeTab={props.activeTab}
          viewWidth={props.viewWidth}
        />
      )}
    </>
  );
};

const MobileNav = props => {
  return (
    <>
      <NavbarBrand
        className={cnames(
          navbar.header,
          "border border-dark rounded thick-border",
          "px-3 py-1",
          "font-weight-bold"
        )}
        href="/"
      >
        Nick Caceres
      </NavbarBrand>
      <Collapse isOpen={props.isOpened} navbar>
        <NavList
          openTab={props.openTab}
          activeTab={props.activeTab}
          viewWidth={props.viewWidth}
          collapseNav={props.collapseNav}
        />
      </Collapse>
    </>
  );
};

const FullNav = props => {
  return (
    <>
      <Collapse isOpen={props.isOpened} navbar>
        <NavList
          openTab={props.openTab}
          activeTab={props.activeTab}
          viewWidth={props.viewWidth}
        />
      </Collapse>
      <NavbarBrand
        className={cnames(
          navbar.brand, // indicates css class
          "border border-dark rounded thick-full-border",
          "px-3 py-1",
          "font-weight-bold"
        )}
        href="/resume-react"
      >
        Nick Caceres
      </NavbarBrand>
    </>
  );
};

const NavList = props => {
  return (
    <Nav
      pills
      className={cnames({
        "flex-row": props.viewWidth >= 768,
        "flex-column": props.viewWidth < 768
      })}
    >
      <NavButtons
        activeTab={props.activeTab}
        openTab={props.openTab}
        collapseNav={props.collapseNav}
        viewWidth={props.viewWidth}
      />
    </Nav>
  );
};

const NavButtons = props => {
  const tabNames = {
    iOS: "iOS",
    android: "Android",
    "front-end": "Front-End Web",
    "back-end": "Back-End Web"
  };

  return [...Array(4)].map((_, i) => {
    return (
      <NavItem
        className="mx-3 mx-md-1 my-1 border border-dark rounded"
        style={{ height: 40 + "px" }}
        key={tabNames[Object.keys(tabNames)[i]]}
      >
        <NavLink // Different than Reactstrap or reg 'a' tag - doesn't require href attr
          to={`/${Object.keys(tabNames)[i]}`}
          className={cnames(navbar.navButton, "text-wrap px-3 w-100 h-100", {
            //[navbar.navButton]: props.activeTab !== Object.keys(tabNames)[i],
            //[navbar.activeNavButton]: props.activeTab === Object.keys(tabNames)[i],
            //active: props.activeTab === Object.keys(tabNames)[i]
          })}
          activeClassName={navbar.activeNavButton}
          onClick={() => {
            //props.openTab(Object.keys(tabNames)[i]);
            window.scrollTo(0, 0);
            if (props.viewWidth < 768) {
              props.collapseNav();
            }
          }}
        >
          {tabNames[Object.keys(tabNames)[i]]}
        </NavLink>
      </NavItem>
    );
  });
};

export default SimpleNavbar;
