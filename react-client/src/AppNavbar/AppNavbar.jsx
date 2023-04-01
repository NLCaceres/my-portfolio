import React, { useEffect, useState } from "react";
import NavbarCss from "./Navbar.module.css";
import Logo from "../logo.svg";
import { SmoothScroll } from "../Utility/Functions/Browser";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { Link, NavLink } from "react-router-dom";

/* //? Repackaging of React-bootstrap navbar into something a bit more convenient */
const AppNavbar = () => {
  const [expanded, setExpanded] = useState(false); //* Init state = false
  useEffect(() => {
    function expansionListener(event) { //? Contains() works on DomNodes + better supported than String.includes()
      (event.target.classList.contains("navbar-toggler") || event.target.className === "navbar-toggler-icon") ?
        setExpanded(!expanded) : setExpanded(false) //* If not the toggler or icon, then click must close nav
    }
    document.addEventListener("click", expansionListener)
    return () => { document.removeEventListener("click", expansionListener) } //* Cleanup listener
  })
  return (
    <Navbar className={NavbarCss.header} expand="md" expanded={expanded}>
      <Container fluid>
        <Navbar.Toggle className="align-self-start mt-1" aria-controls="basic-navbar-nav" />
        <FullNav />
      </Container>
    </Navbar>
  )
}

const FullNav = () => {
  return ( //* Collapse receives 'order: 2' in CSS Module to place it after Brand on mobile (avoiding weird collapsible section)
    <>
      <Navbar.Collapse className={`${NavbarCss['nav-collapse']}`} data-testid="nav-collapse">
        <Nav variant="pills" className={`${`${NavbarCss['nav-container']}`}`}>
          <NavButtons />
        </Nav>
      </Navbar.Collapse>
      {/*//? Imitate Bootstrap Navbar Brand BUT navigate via React-Router, not via the browser */}
      <Link className={`${NavbarCss.brand} navbar-brand`} to="/portfolio/about-me" onClick={ SmoothScroll }>
        Nick Caceres
        <img src={Logo} className="ms-2" width="45" height="45" alt="Brand Logo"></img>
      </Link>
    </>
  );
};

const NavButtons = () => {
  const tabProperNames = { iOS: "iOS", android: "Android", 
    "front-end": "Front-End Web", "back-end": "Back-End Web" };
  const tabKeyNames = Object.keys(tabProperNames);
  //? Must pass this func to React-Router-Dom's NavLink so it can apply certain classes when it's the active/matching route
  const isActiveClasses = ({isActive}) => //? Must include 'nav-link' class to adopt Bootstrap styles
    `nav-link ${NavbarCss.navButton} ${(isActive) ? NavbarCss.activeNavButton : ""}`.trim()

  return [...Array(tabKeyNames.length)].map((_, i) => {
    const tabKeyName = tabKeyNames[i];
    return (
      <Nav.Item className={`border border-dark rounded ${NavbarCss.navItem}`}
        key={ tabProperNames[tabKeyName] }>
          <NavLink to={`portfolio/${tabKeyName}`} className={isActiveClasses} onClick={ SmoothScroll }>
              { tabProperNames[tabKeyName] }
          </NavLink>
      </Nav.Item>
    );
  });
};

export default AppNavbar;
