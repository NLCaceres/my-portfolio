import FooterCss from './Footer.module.css';
import Button from 'react-bootstrap/Button';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from 'react-bootstrap/Container'

const Footer = props => {
  const ContactUs = (props.viewWidth < 576) ? (
      <Nav.Link className={`rounded border border-dark text-dark ${FooterCss.navLink}`} href="/contact-me">
        Contact Me
      </Nav.Link>
    ) : (
      <Button variant="outline-dark" className={`${FooterCss.contactButton}`} onClick={ props.modalOpen }>
        Contact Me
      </Button>
    );

  return (
    <Navbar variant="dark" expand="md" className={`mt-4 ${FooterCss.navFooter}`}>
      <Container fluid>
        { ContactUs }
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className={`mx-sm-1 text-dark fst-italic ${FooterCss.navbarText}`}>Built by Nick Caceres,</Navbar.Text>
          <Navbar.Text className={`mx-sm-1 text-dark fst-italic ${FooterCss.navbarText}`}>Crafted with React & Rails,</Navbar.Text>
          <Navbar.Text className={`mx-sm-1 text-dark fst-italic ${FooterCss.navbarText}`}>Powered by Heroku</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Footer;