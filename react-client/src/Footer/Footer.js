import FooterCss from "./Footer.module.css";
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";

const Footer = ({ contactButtonOnClick }) => { 
  return (
    <Navbar variant="dark" expand="md" className={FooterCss.navFooter}>
      <Container fluid>
        <Button variant="outline-dark" className={FooterCss.contactButton} onClick={ contactButtonOnClick }>
          Contact Me
        </Button>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className={`text-dark ${FooterCss.navbarText}`}>Built by Nick Caceres,</Navbar.Text>
          <Navbar.Text className={`text-dark ${FooterCss.navbarText}`}>Crafted with React & Rails,</Navbar.Text>
          <Navbar.Text className={`text-dark ${FooterCss.navbarText}`}>Powered by Railway</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Footer;