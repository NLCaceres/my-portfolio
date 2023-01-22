import React, { useCallback, useState } from 'react';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import TurnstileWidget from '../Utility/Components/TurnstileWidget';
import cnames from "classnames";
import ContactPageFormCss from "./ContactPageForm.module.css";
import { ProcessTurnstileResponse, SendEmail } from '../Utility/Functions/Api';
import ConsoleLogger from '../Utility/Functions/LoggerFuncs';

const ContactPageForm = ({ onSubmitForm, darkMode }) => {
  //! Computed Prop
  const IsContactable = (process.env.REACT_APP_CONTACTABLE === 'true') ? true : false; //* All env vars are actually strings
  //! State
  //* If not contactable, don't verify. IsContactable var only used onMount, later rerenders remember most recent state
  const [isVerifying, setIsVerifying] = useState(IsContactable);

  const [newEmail, setNewEmail] = useState({email: '', message: '', cfToken: ''});
  const updateEmailValue = (key, value) => { setNewEmail(email => { email[key] = value; return email }) }; //* No useCallback needed

  const turnstileSuccessCallback = useCallback((token) => { //* Need useCallback to prevent turnstile widget re-rendering & double firing
    setIsVerifying(false) //* Done checking, either received an undefined token or a string token to send to backend
    setNewEmail(email => { email.cfToken = token; return email });
  }, []);
  
  //! Form Handler
  const SubmitContactForm = useCallback(async (event) => {
    event.preventDefault(); event.stopPropagation(); //* Prevent page reload
    if (!IsContactable) { return }
  
    const isSuccessful = await ProcessTurnstileResponse(SendEmail(newEmail), "Successfully sent your email!");
    if (onSubmitForm) { onSubmitForm(isSuccessful) } //* Also need to handle parent's callback
    if (isSuccessful) { }
    else { } //* Error w/ either turnstile or sending the email
  }, [IsContactable, onSubmitForm, newEmail])

  return (
    <Form onSubmit={ SubmitContactForm } className={ cnames({ "dark": darkMode }) } data-testid="form-container">
      { /* Using column to size appropriately at smaller viewports */ }
      <Form.Group controlId="inputEmail" as={ Col } xs="10" sm="8" className="mb-3">
        <Form.Label className={`${ContactPageFormCss.formLabel}`}>Email Address</Form.Label>
        <Form.Control className="px-2" type="email" placeholder="Please enter your email" onChange={e => updateEmailValue('email', e.target.value) } />
      </Form.Group>
      <Form.Group controlId="inputMessage" className="mb-3">
        <Form.Label className={`${ContactPageFormCss.formLabel}`}>Message</Form.Label>
        <Form.Control className="px-2" type="message" placeholder="Your Message" as="textarea" rows={ 3 } onChange={e => updateEmailValue('message', e.target.value) } />
      </Form.Group>

      <div className={`my-1 ${ContactPageFormCss['button-container']}`}>
        <TurnstileWidget action="Contact-Page-Form" successCB={turnstileSuccessCallback} />

        <Button className={`${ContactPageFormCss.submitButton}`} type="submit" disabled={ !IsContactable || isVerifying }>
          { (isVerifying && IsContactable) //* Show loading spinner when verifying and NOT disabled
            && <Spinner className="me-2" as="span" animation="border" size="sm" role="status" aria-hidden="true"/> }

          { !IsContactable ? "Currently Unavailable" : //* Separate conditions to set text for button
            (isVerifying) ? "Checking You're Human!" : 
            (newEmail.cfToken === undefined) ? "Try Again Later" : "Contact Me" }
        </Button>
      </div>
    </Form>
  )
}

export default ContactPageForm;