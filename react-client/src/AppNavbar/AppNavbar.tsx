import { useEffect, useState } from "react";
import NavbarCss from "./Navbar.module.css";
import Logo from "../logo.svg";
import { SmoothScroll } from "../Utility/Functions/Browser";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "@tanstack/react-router";

/* //? Repackaging of React-bootstrap navbar into something a bit more convenient */
const AppNavbar = () => {
  const [expanded, setExpanded] = useState(false); //* Init state = false
  useEffect(() => {
    function expansionListener(event: Event) {
      if (!event.target || !(event.target instanceof Element)) { return; } //* Early return if target is falsy or not type Element
      //? Contains() works on DomNodes + better supported than String.includes()
      (event.target.classList.contains("navbar-toggler") || event.target.className === "navbar-toggler-icon") ?
        setExpanded(!expanded) : setExpanded(false); //* If not the toggler or icon, then click must close nav
    }
    document.addEventListener("click", expansionListener);
    return () => { document.removeEventListener("click", expansionListener); }; //* Cleanup listener
  });
  return (
    <Navbar className={NavbarCss.header} expand="md" expanded={expanded}>
      <Container fluid>
        <Navbar.Toggle className="align-self-start mt-1" aria-controls="basic-navbar-nav" />
        <FullNav />
      </Container>
    </Navbar>
  );
};

const FullNav = () => {
  return ( //* Collapse receives 'order: 2' in CSS Module to place it after Brand on mobile (avoiding weird collapsible section)
    <>
      <Navbar.Collapse className={`${NavbarCss["nav-collapse"]}`} data-testid="nav-collapse">
        <Nav variant="pills" className={`${`${NavbarCss["nav-container"]}`}`}>
          <NavButtons />
        </Nav>
      </Navbar.Collapse>
      <Link className={`${NavbarCss.brand} navbar-brand`}
            to="/portfolio/$postId" params={{ postId: "about-me" }} onClick={ SmoothScroll }>
        Nick Caceres
        <img src={Logo} className="ms-2" width="45" height="45" alt="Brand Logo"></img>
      </Link>
    </>
  );
};

const NavButtons = () => {
  const tabProperNames = { iOS: "iOS", android: "Android",
    "front-end": "Front-End Web", "back-end": "Back-End Web" };

  return (Object.keys(tabProperNames) as Array<keyof typeof tabProperNames>).map(keyName => {
    return (
      <Nav.Item key={ tabProperNames[keyName] } className={`border border-dark rounded ${NavbarCss.navItem}`}>
        <Link className={`nav-link ${NavbarCss.navButton}`} onClick={SmoothScroll}
              to="/portfolio/$postId" params={{ postId: keyName }}>
          { tabProperNames[keyName] }
        </Link>
      </Nav.Item>
    );
  });
};

export default AppNavbar;
