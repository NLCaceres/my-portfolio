import { requireLength, validEmail } from "../Utility/Functions/Validation";

export type ContactFormValidationErrors = {
  [index: string]: string[]

  email: string[],
  message: string[]
};

export type ContactFormData = {
  email: string,
  message: string
};

export default function validate(contactForm: ContactFormData): ContactFormValidationErrors {
  const validationErrors: ContactFormValidationErrors = { email: [], message: [] };

  if (!requireLength(contactForm.email)) { validationErrors.email.push("Email required"); }
  if (!validEmail(contactForm.email)) { validationErrors.email.push("Your email appears to be incorrect"); }

  if (!requireLength(contactForm.message, 10)) { validationErrors.message.push("Message must be greater than 10 characters"); }

  return validationErrors;
}

