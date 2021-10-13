import React from 'react';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import ContactPageFormCss from "./ContactPageForm.module.css";
import cnames from "classnames";
// import ConsoleLogger from '../Utility/Functions/LoggerFuncs';

class ContactPageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: {
        email: '',
        message: ''
      }
    }
  }

  IsDisabled = () => {
    const IsContactable = (process.env.REACT_APP_CONTACTABLE === 'true') ? true : false; //* All env vars are actually strings
    const disableContact = !IsContactable; //* If not contactable than disable button
    return disableContact;
  }
  IsVerifying = () => {
    return true;
  }

  render() {
    //? While not all of react-bootstrap exposes className, THANKFULLY forms do!
    return (
      <Form onSubmit={ this.props.onSubmitForm } className={ cnames({ "dark": this.props.darkMode }) }>
        <Form.Row>
          <Form.Group controlId="senderEmail" as={ Col } xs="10" sm="8">
            <Form.Label className={`ml-n2 ${ContactPageFormCss.formLabel}`}>Email Address</Form.Label>
            <Form.Control className="px-2" type="email" placeholder="Please enter your email" />
          </Form.Group>
        </Form.Row>
        <Form.Group controlId="senderMessage">
          <Form.Label className={`ml-n2 ${ContactPageFormCss.formLabel}`}>Message</Form.Label>
          <Form.Control className="px-2" type="message" placeholder="Your Message" as="textarea" rows={ 3 } />
        </Form.Group>

        <div className="mt-1 d-flex justify-content-end"> 
          <Button className={`${ContactPageFormCss.submitButton}`} type="submit" disabled={ this.IsDisabled() || this.IsVerifying() }>
            { (!this.IsDisabled()) && <Spinner className="mr-2" as="span" animation="border" size="sm" role="status" aria-hidden="true"/> }
            { this.IsDisabled() ? "Currently Unavailable" : (this.IsVerifying()) ? "Checking You're Human!" : "Contact Me" }
          </Button>
        </div>
      </Form>
    );
  }
}

export default ContactPageForm;