import { type FormEvent, useCallback, useState } from "react";
import useViewWidth from "../ContextProviders/ViewWidthProvider";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AppSpinner from "../AppSpinner/AppSpinner";
import TurnstileWidget from "../ThirdParty/TurnstileWidget";
import ContactPageFormCss from "./ContactPageForm.module.css";
import validate, { ContactFormValidationErrors } from "./validator";
import { ProcessTurnstileResponse } from "../Data/Api/ThirdParty";
import { SendEmail } from "../Data/Api/Common";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

interface ContactPageFormProps { 
  onSubmitForm?: (successful: boolean) => void, 
  darkMode: boolean
}

const defaultProps = {
  darkMode: false
}

const ContactPageForm = ({ onSubmitForm, darkMode }: ContactPageFormProps & typeof defaultProps) => {
  //! Computed Prop
  const IsContactable = (import.meta.env.VITE_CONTACTABLE === "true") ? true : false; //* All env vars are actually strings
  const viewWidth = useViewWidth();
  //! State
  //* If not contactable, don't verify. IsContactable var only used onMount, later rerenders remember most recent state
  const [isVerifying, setIsVerifying] = useState(IsContactable);

  const [newEmail, setNewEmail] = useState({email: "", message: "", cfToken: ""});
  const updateEmailValue = (key: string, value: string) => { setNewEmail({ ...newEmail, [key]: value }) }; //* No useCallback needed
  const [validationErrors, setValidationErrors] = useState<ContactFormValidationErrors>({ email: [], message: [] });

  const turnstileSuccessCallback = useCallback((token: string) => { //* Need useCallback to prevent turnstile widget re-rendering & double firing
    setIsVerifying(false); //* Done checking, either received an undefined token or a string token to send to backend
    setNewEmail(oldEmail => ({ ...oldEmail, cfToken: token })); //* Using an update func avoids requiring newEmail state in dependency array
  }, []);
  
  //! Form Handler
  const SubmitContactForm = useCallback(async (event: FormEvent) => {
    event.preventDefault(); event.stopPropagation(); //* Prevent page reload
    if (!IsContactable) { return }
  
    //! Validate
    const errors = validate({ email: newEmail.email, message: newEmail.message });
    for (let key in errors) { if (errors[key].length > 0) { setValidationErrors(errors); return } } //* Activate Validation Feedback

    const isSuccessful = await ProcessTurnstileResponse(SendEmail(newEmail), "Successfully sent your email!");
    if (onSubmitForm) { onSubmitForm(isSuccessful) } //* Also need to handle parent's callback
    if (isSuccessful) { }
    else { } //* Error w/ either turnstile or sending the email
  }, [IsContactable, onSubmitForm, newEmail])

  return ( //* NoValidate ensures Browser doesn't apply its own validation to this form
    <Form noValidate onSubmit={ SubmitContactForm } className={(darkMode) ? "dark" : ""} data-testid="form-container">
      { /* Using column to size appropriately at smaller viewports */ }
      <Form.Group controlId="inputEmail" as={ Col } xs="10" sm="8" className="mb-3">
        <Form.Label className={ContactPageFormCss.formLabel}>Email Address</Form.Label>
        <Form.Control className="px-2" type="email" placeholder="Please enter your email" 
          isInvalid={validationErrors.email.length > 0} onChange={e => updateEmailValue('email', e.target.value) } />
        { validationErrors.email.map((error) => <Form.Control.Feedback key={error} type="invalid">{ error }</Form.Control.Feedback>) }
      </Form.Group>
      <Form.Group controlId="inputMessage" className="mb-3">
        <Form.Label className={ContactPageFormCss.formLabel}>Message</Form.Label>
        <Form.Control className="px-2" type="message" placeholder="Your Message" as="textarea" rows={ 3 } 
          isInvalid={validationErrors.message.length > 0} onChange={e => updateEmailValue('message', e.target.value) } />
        { validationErrors.message.map((error) => <Form.Control.Feedback key={error} type="invalid">{ error }</Form.Control.Feedback>) }
      </Form.Group>

      <div className={ContactPageFormCss['button-container']}>
        <TurnstileWidget action="Contact-Page-Form" compact={viewWidth <= 320} successCB={turnstileSuccessCallback} />

        <Button className={ContactPageFormCss.submitButton} type="submit" disabled={ !IsContactable || isVerifying }>
          { (isVerifying && IsContactable) && <AppSpinner tag="span" small /> } { /*//* Show when verifying and NOT disabled */ }

          { !IsContactable ? "Currently Unavailable" : //* Separate conditions to set text for button
            (isVerifying) ? "Checking You're Human!" : 
            (newEmail.cfToken === undefined) ? "Try Again Later" : "Contact Me" }
        </Button>
      </div>
    </Form>
  )
}

ContactPageForm.defaultProps = defaultProps;
export default ContactPageForm;