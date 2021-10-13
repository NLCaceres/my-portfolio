import React, { Component } from "react";
import Logo from "../logo.svg";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse } from "reactstrap";
import cnames from "classnames";
import NavbarCss from "./Navbar.module.css";

class SimpleNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <>
        <Navbar className={cnames(NavbarCss.header, "sticky-top")} light expand="md">
          <NavbarToggler onClick={ this.toggle } className="align-self-start mt-1" />
          <FullNav isOpen={ this.state.isOpen } viewWidth={ this.props.viewWidth } toggleNav={ this.toggle } />
        </Navbar>
      </>
    );
  }
}

const FullNav = props => {
  return ( //* Collapse receives 'order-2' to force it after Brand on mobile (avoiding weird collapsible section)
    <>
      <Collapse isOpen={ props.isOpen } navbar className={cnames({ "order-2": props.viewWidth < 768 })}>
        <Nav pills className={`${(props.viewWidth < 768) ? 'flex-column' : 'flex-row'}`}>
          <NavButtons toggleNav={ props.toggleNav } viewWidth={ props.viewWidth } />
        </Nav>
      </Collapse>
      <NavbarBrand className={`${NavbarCss.brand} px-3 py-0`} href="/portfolio" >
        Nick Caceres
        <img src={Logo} className="ml-2" width="45" height="45" alt=""></img>
      </NavbarBrand>
    </>
  );
};

const NavButtons = props => {
  const tabProperNames = { iOS: "iOS", android: "Android", 
    "front-end": "Front-End Web", "back-end": "Back-End Web" };

  return [...Array(4)].map((_, i) => {
    const tabKeyNames = Object.keys(tabProperNames);
    return (
      <NavItem className={`mx-3 mx-md-1 my-1 border border-dark rounded ${NavbarCss.navItem}`}
        style={{ height: 40 + "px" }} key={ tabProperNames[tabKeyNames[i]] }>
          <NavLink to={`/${tabKeyNames[i]}`} //? React-router doesn't require href attr
            className={`${NavbarCss.navButton} text-wrap px-3 w-100 h-100`}
            activeClassName={NavbarCss.activeNavButton}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (props.viewWidth < 768) props.toggleNav(); //* 99% of the time this should close the nav
            }}>
              { tabProperNames[tabKeyNames[i]] }
          </NavLink>
      </NavItem>
    );
  });
};

export default SimpleNavbar;
