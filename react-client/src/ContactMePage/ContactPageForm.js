import React, { useState } from 'react';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import ContactPageFormCss from "./ContactPageForm.module.css";
import cnames from "classnames";
import ConsoleLogger from '../Utility/Functions/LoggerFuncs';
import UseRecaptcha from '../Utility/Hooks/UseRecaptcha';

const ContactPageForm = props => {
  //* Computed Prop
  const IsContactable = (process.env.REACT_APP_CONTACTABLE === 'true') ? true : false; //* All env vars are actually strings
  //* State
  const [sender, setSender] = useState({email: '', message: ''});
  const initLoadState = (IsContactable) ? true : false;
  const [isLoading, setIsLoading] = useState(initLoadState); //* initLoadState only used onMounting, later rerenders remember most recent state
  let recaptchaScore = 0.0;
  recaptchaScore = UseRecaptcha(() => { if (IsContactable) setIsLoading(false) })
  //* Form Handler
  const SubmitContactForm = (event) => {
    if (props.onSubmitForm) props.onSubmitForm(event); //* Handle parents callback
  
    if (recaptchaScore > 0.7) { ConsoleLogger(`Human! Submit contact message`); }
    else { ConsoleLogger(`Not human disable.`); }
  }

  return (
    <Form onSubmit={ SubmitContactForm } className={ cnames({ "dark": props.darkMode }) } data-testid="form-container">
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
        <Button className={`${ContactPageFormCss.submitButton}`} type="submit" disabled={ !IsContactable || isLoading }>
          { (isLoading && IsContactable) //* Show loading spinner when verifying and NOT disabled
            && <Spinner className="mr-2" as="span" animation="border" size="sm" role="status" aria-hidden="true"/> }

          { !IsContactable ? "Currently Unavailable" : //* Separate conditions to set text for button
            (isLoading) ? "Checking You're Human!" : "Contact Me" }
        </Button>
      </div>
    </Form>
  )
}

export default ContactPageForm;