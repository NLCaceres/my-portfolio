import footerCss from './Footer.module.css';
import Button from 'react-bootstrap/Button';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const Footer = props => {
  
  const ContactUs = (props.viewWidth < 576) ? (
      <Nav.Link className={`rounded border border-dark text-dark ${footerCss.navLink}`} href="/contact-me">
        Contact Me
      </Nav.Link>
    ) : (
      <Button variant="outline-dark" className={`${footerCss.contactButton}`} onClick={ () => props.modalOpen(true) }>
        Contact Me
      </Button>
    );

  return (
    <Navbar variant="dark" expand="md" className={`mt-4 ${footerCss.navbar}`}>
      { ContactUs }
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text className={`mx-sm-1 text-dark font-italic ${footerCss.navbarText}`}>Built by Nick Caceres,</Navbar.Text>
        <Navbar.Text className={`mx-sm-1 text-dark font-italic ${footerCss.navbarText}`}>Crafted with React & Rails,</Navbar.Text>
        <Navbar.Text className={`mx-sm-1 text-dark font-italic ${footerCss.navbarText}`}>Powered by Heroku</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Footer;