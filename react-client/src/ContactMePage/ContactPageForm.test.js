import React from "react";
import { render, fireEvent, waitFor, screen, prettyDOM } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import ContactPageForm from "./ContactPageForm";
import * as API from "../Utility/Functions/Api";
import * as UseRecaptcha from '../Utility/Hooks/UseRecaptcha';
import SilenceWarning from "../Utility/Functions/Tests/WarningSilencer";

const originalEnv = process.env;

describe("renders the form for the contact page", () => {
  describe("that depends on '_CONTACTABLE' env var for conditionally rendering", () => {
    test("a spinner in the submit button when running an async task", async () => {
      expect(process.env.REACT_APP_CONTACTABLE).toBe('true');
      const recaptchaMock = jest.spyOn(UseRecaptcha, 'default').mockImplementation(() => 1.0);
      const { unmount } = render(<ContactPageForm />) //* Contactable = true + isLoading = true
      const submitButtonSpinner = screen.getByRole('status', { hidden: true });
      expect(submitButtonSpinner).toBeInTheDocument();

      process.env = {
        ...originalEnv,
        REACT_APP_CONTACTABLE: 'false'
      }
      expect(process.env.REACT_APP_CONTACTABLE).toBe('false');
      unmount();
      const { unmount: secondUnmount } = render(<ContactPageForm />) //* Contactable = false + isLoading = false
      expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();

      process.env = originalEnv;
      secondUnmount();
      recaptchaMock.mockRestore();

      //* Normal flow w/ mocked implementation
      const apiMock = jest.spyOn(API, 'VerifyRecaptcha').mockImplementation(() => new Promise(resolve => { setTimeout(() => { resolve(0) }, 50) }));
      render(<ContactPageForm />); //* Contactable = true + isLoading = true (BUT useRecaptcha will setIsLoading(false) later!)
      const finalSubmitButtonSpinner = screen.getByRole('status', { hidden: true });
      expect(finalSubmitButtonSpinner).toBeInTheDocument();
      //? Next line deals with act() warning + allows hook to call setIsLoading causing spinner to disappear
      await waitFor(() => { expect(finalSubmitButtonSpinner).not.toBeInTheDocument() });
      apiMock.mockRestore();
    })
    test("3 specific tests in the submit button", async () => {
      //* Currently Unavailable
      process.env = {
        ...originalEnv,
        REACT_APP_CONTACTABLE: 'false'
      }
      const recaptchaMock = jest.spyOn(UseRecaptcha, 'default').mockImplementation(() => 1.0);
      const { unmount } = render(<ContactPageForm />) //* Contactable = true + isLoading = true
      const unavailableSubmitButton = screen.getByRole('button', { name: /currently unavailable/i });
      expect(unavailableSubmitButton).toBeInTheDocument();
      unmount();

      //* Checking You're Human
      process.env = originalEnv;
      expect(process.env.REACT_APP_CONTACTABLE).toBe('true');
      const { unmount: secondUnmount } = render(<ContactPageForm />) //* Contactable = true + isLoading = true
      const loadingSubmitButton = screen.getByRole('button', { name: /checking you're human!/i })
      expect(loadingSubmitButton).toBeInTheDocument(); //* Get 'loading' button, NOT 'unavailable' button
      secondUnmount();
      recaptchaMock.mockRestore();

      //* Contact Me
      const apiMock = jest.spyOn(API, 'VerifyRecaptcha').mockImplementation(() => new Promise(resolve => { setTimeout(() => { resolve(0) }, 50) }));
      render(<ContactPageForm />) //* Contactable = true + isLoading = true
      //* Briefly get 'loading' button, NOT 'unavailable' button, then finally 'contact me' button
      expect(screen.getByRole('button', { name: /checking you're human!/i })).toBeInTheDocument();
      const contactMeButton = await screen.findByRole('button', { name: /contact me/i });
      expect(contactMeButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /currently unavailable/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /checking you're human!/i })).not.toBeInTheDocument();
      apiMock.mockRestore();
    })
    test("a disabled submit button if '_CONTACTABLE' = false OR 'isLoading' = true", async () => {
      process.env = {
        ...originalEnv,
        REACT_APP_CONTACTABLE: 'false'
      }

      const recaptchaMock = jest.spyOn(UseRecaptcha, 'default').mockImplementation(() => 1.0);
      const onSubmitFunc = jest.fn(e => e.preventDefault());
      const { unmount } = render(<ContactPageForm onSubmitForm={onSubmitFunc}/>);
      const submitButton = screen.getByRole('button', { name: /currently unavailable/i});
      expect(onSubmitFunc).not.toBeCalled();

      const user = userEvent.setup();
      await user.click(submitButton) //* If used fireEvent for a submit event, form would fire the func anyway!
      expect(onSubmitFunc).not.toBeCalled();

      process.env = originalEnv;
      //* Need full unmount to set isLoading to true, rerender won't call useState again
      unmount(); render(<ContactPageForm onSubmitForm={onSubmitFunc}/>);
      const loadingSubmitButton = screen.getByRole('button', { name: /checking you're human/i});
      expect(onSubmitFunc).not.toBeCalled();

      await user.click(loadingSubmitButton) //* If used fireEvent for a submit event, form would fire the func anyway!
      expect(onSubmitFunc).not.toBeCalled();

      recaptchaMock.mockRestore();
    })
  })
  test("that has a toggleable dark mode", () => {
    const apiMock = jest.spyOn(API, 'VerifyRecaptcha').mockImplementation(() => new Promise(resolve => { setTimeout(() => { resolve(0) }, 50) }));
    const { rerender } = render(<ContactPageForm />);
    const formContainer = screen.getByTestId('form-container');
    expect(formContainer).not.toHaveClass('dark');

    rerender(<ContactPageForm darkMode={true} />);
    expect(formContainer).toHaveClass('dark');
    apiMock.mockRestore();
  })
  test("that accepts a customizable onSubmit callback", async () => {
    const apiMock = jest.spyOn(API, 'VerifyRecaptcha').mockImplementation(() => new Promise(resolve => { resolve(1) }));
    //? preventDefault prevents a jest-dom form submit 'not-implemented' err (better solution may one day come BUT this seems easiest/best)
    //? ALSO this trick assumes usage in onClick or onSubmit that accepts an event param by default!, if the func isn't used in that type of prop
    //? usage will not match since the func call probably won't have any params (or maybe too many!) and jest will throw an error that is e is undefined
    const onSubmitFunc = jest.fn(e => e.preventDefault());
    const { rerender } = render(<ContactPageForm onSubmitForm={onSubmitFunc}/>)
    const contactSubmitButton = await screen.findByRole('button', { name: /contact me/i });
    expect(onSubmitFunc).not.toBeCalled();
    
    fireEvent.submit(screen.getByTestId('form-container'))
    expect(onSubmitFunc).toHaveBeenCalledTimes(1);
    
    fireEvent.submit(contactSubmitButton)
    expect(onSubmitFunc).toHaveBeenCalledTimes(2);
    
    const user = userEvent.setup();
    await user.click(contactSubmitButton)
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    const origErrorConsole = SilenceWarning(); //* Temp form submit not implemented error ignore
    rerender(<ContactPageForm />)
    fireEvent.submit(screen.getByTestId('form-container'))
    //* submitFunc prop now null, so it shouldn't be called anymore!
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    fireEvent.submit(contactSubmitButton)
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    await user.click(contactSubmitButton)
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    window.console.error = origErrorConsole; //* Restore error log
    apiMock.mockRestore();
  })
})