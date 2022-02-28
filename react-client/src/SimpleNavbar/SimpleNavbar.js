import React, { useEffect, useState } from "react";
import Logo from "../logo.svg";
import { NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import cnames from "classnames";
import NavbarCss from "./Navbar.module.css";

/* //? Repackaging of React-bootstrap navbar into something a bit more convenient 
@params viewWidth - Passed through to add CSS */
const SimpleNavbar = props => {
  const [expanded, setExpanded] = useState(false); //* Init state = false
  useEffect(() => {
    function expansionListener(event) { //? Contains() works on DomNodes + better supported than String.includes()
      (event.target.classList.contains('navbar-toggler') || event.target.className === 'navbar-toggler-icon') ?
        setExpanded(!expanded) : setExpanded(false) //* If not the toggler or icon, then click must close nav
    }
    document.addEventListener('click', expansionListener)
    return () => { document.removeEventListener('click', expansionListener) } //* Cleanup listener
  })
  return (
    <Navbar className={cnames(NavbarCss.header, "sticky-top")} expand="md" expanded={expanded}>
      <Navbar.Toggle className="align-self-start mt-1" aria-controls="basic-navbar-nav" />
      <FullNav viewWidth={ props.viewWidth } />
    </Navbar>
  )
}

const FullNav = props => {
  return ( //* Collapse receives 'order-2' to force it after Brand on mobile (avoiding weird collapsible section)
    <>
      <Navbar.Collapse className={cnames({ "order-2": props.viewWidth < 768 })} data-testid="nav-collapse">
        <Nav variant="pills" className={`${(props.viewWidth < 768) ? 'flex-column' : 'flex-row'}`}>
          <NavButtons viewWidth={ props.viewWidth } />
        </Nav>
      </Navbar.Collapse>
      <Navbar.Brand className={`${NavbarCss.brand} px-3 py-0`} href="/" >
        Nick Caceres
        <img src={Logo} className="ml-2" width="45" height="45" alt="Brand Logo"></img>
      </Navbar.Brand>
    </>
  );
};

const NavButtons = () => {
  const tabProperNames = { iOS: "iOS", android: "Android", 
    "front-end": "Front-End Web", "back-end": "Back-End Web" };
  const tabKeyNames = Object.keys(tabProperNames);

  return [...Array(tabKeyNames.length)].map((_, i) => {
    const tabKeyName = tabKeyNames[i];
    return (
      <Nav.Item className={`mx-3 mx-md-1 my-1 border border-dark rounded ${NavbarCss.navItem}`}
        style={{ height: 40 + "px" }} key={ tabProperNames[tabKeyName] }>
          {/* //? Can use ReactRouter's NavLinks w/ 'to' prop thanks to react-bootstrap's Nav.Link's 'as' prop */}
          <Nav.Link as={NavLink} to={`/portfolio/${tabKeyName}`}
            className={`${NavbarCss.navButton} text-wrap px-3 w-100 h-100`}
            activeClassName={ NavbarCss.activeNavButton }
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) } }>
              { tabProperNames[tabKeyName] }
          </Nav.Link>
      </Nav.Item>
    );
  });
};

export default SimpleNavbar;
