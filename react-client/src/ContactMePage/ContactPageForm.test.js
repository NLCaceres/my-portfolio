import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPageForm from "./ContactPageForm";
import SilenceWarning from "../Utility/TestHelpers/WarningSilencer";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
import * as CommonAPI from "../Api/Common";
import * as Validator from "./validator";
import * as TurnstileAPI from "../Api/ThirdParty";

const originalEnv = process.env;
jest.mock("../ThirdParty/TurnstileWidget", () => ({ action, compact, successCB, className }) => {
  const compactClass = (compact) ? "compact" : "normal";
  return (<div className={compactClass}><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
})

// const tokenTurnstileMock = ({action, successCB, className }) => { //? Useful if using doMock like in line 21
//   //* Why a button? Easiest way to activate callback + it matches the Turnstile Challenge button in terms of UX
//   return (<div><button type="button" onClick={() => { successCB("123") }}>Dummy Node</button></div>);
// }
describe("renders the form for the contact page", () => {
  // beforeEach(() => { jest.resetModules(); }) //* As of Jest 27, resetModules() seems bugged, crashing Functional React Components using Hooks
  test("that has a toggleable dark mode", async () => {
    //? If just mocking the default export (and not importing any others) then the following works! OTHERWISE: See line 56
    //* jest.doMock("../ThirdParty/TurnstileWidget", () => tokenTurnstileMock);
    // const ContactPageForm = (await import("./ContactPageForm")).default; //? Must re-import ContactPageForm component every doMock test
    const { rerender } = render(<ContactPageForm />);
    const formContainer = screen.getByTestId("form-container");
    expect(formContainer).not.toHaveClass("dark");

    rerender(<ContactPageForm darkMode={true} />);
    expect(formContainer).toHaveClass("dark");
  })
  describe("that depends on '_CONTACTABLE' env var for conditionally rendering", () => {
    test("a spinner in the submit button when running an async task", async () => {
      expect(process.env.REACT_APP_CONTACTABLE).toBe("true");
      const user = userEvent.setup(); //? Best to call 1st or at least before render is called
      const { unmount } = render(<ContactPageForm />) //* Contactable = true + isVerifying = true
      const submitButtonSpinner = screen.getByRole("status", { hidden: true });
      expect(submitButtonSpinner).toBeInTheDocument();

      process.env = { ...originalEnv, REACT_APP_CONTACTABLE: "false" }
      expect(process.env.REACT_APP_CONTACTABLE).toBe("false");
      unmount();
      const { unmount: secondUnmount } = render(<ContactPageForm />) //* Contactable = false + isVerifying = false
      expect(screen.queryByRole("status", { hidden: true })).not.toBeInTheDocument();

      process.env = originalEnv;
      secondUnmount();

      //* Normal flow w/ mocked implementation
      render(<ContactPageForm />); //* Contactable = true + isVerifying = true (BUT Turnstile widget's callback will run setIsVerifying(false) later!)
      const finalSubmitButtonSpinner = screen.getByRole("status", { hidden: true });
      expect(finalSubmitButtonSpinner).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /turnstile verification button/i })); //* Click turnstile widget button
      expect(finalSubmitButtonSpinner).not.toBeInTheDocument();
    })
    test("a submit button with 'unavailable', 'verifying', or 'contact me' text states", async () => {
      //? If multiple imports needed from file, then must return an object w/ following syntax (__esModule key is very important!)
      //? Only want to partially mock the file? THEN Run "const originalModule = jest.requireActual('dir/path/from/here')", 
      //? then add "...originalModule" to below returned obj, only overriding what's necessary
      // jest.doMock('../ThirdParty/TurnstileWidget', () => { 
      //   return { 
      //     __esModule: true, 
      //     default: ({action, successCB, className }) => {
      //       //* Why a button? Easiest way to activate callback + it matches the Turnstile Challenge button in terms of UX
      //       return (<div><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
      //     } 
      //   }
      // });
      // const ContactPageForm = (await import("./ContactPageForm")).default;
      //* Currently Unavailable
      process.env = { ...originalEnv, REACT_APP_CONTACTABLE: "false" }
      const user = userEvent.setup();
      const { unmount } = render(<ContactPageForm />) //* Contactable = true + isVerifying = true
      const unavailableSubmitButton = screen.getByRole("button", { name: /currently unavailable/i });
      expect(unavailableSubmitButton).toBeInTheDocument();
      unmount();

      //* Checking You're Human then after Turnstile Challenge completed via button click, Contact Me appears in submit button
      process.env = originalEnv;
      expect(process.env.REACT_APP_CONTACTABLE).toBe("true");
      const { unmount: secondUnmount } = render(<ContactPageForm />) //* Contactable = true + isVerifying = true
      const verifyingSubmitButton = screen.getByRole("button", { name: /checking you're human!/i });
      expect(verifyingSubmitButton).toBeInTheDocument(); //* Get "verifying" button, NOT "unavailable" button

      await user.click(screen.getByRole("button", { name: /turnstile verification button/i })); //* Click turnstile widget button
      const contactMeButton = await screen.findByRole("button", { name: /contact me/i });
      expect(contactMeButton).toBeInTheDocument(); //* After verification succeeds and stops, "Contact Me" appears!
      expect(screen.queryByRole("button", { name: /checking you're human!/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /currently unavailable/i })).not.toBeInTheDocument();
      secondUnmount();
    })
    test("a disabled submit button that won't run the submitFunc prop", async () => {
      process.env = { ...originalEnv, REACT_APP_CONTACTABLE: "false" } //* CONTACTABLE == false then no submit called
      const user = userEvent.setup();
      const onSubmitFunc = jest.fn(e => e.preventDefault());
      const { unmount } = render(<ContactPageForm onSubmitForm={onSubmitFunc}/>);
      const submitButton = screen.getByRole("button", { name: /currently unavailable/i});
      expect(onSubmitFunc).not.toBeCalled(); //* No click tried so naturally not called!
      await user.click(submitButton) //* If used fireEvent for a submit event, form would fire the func anyway!
      expect(onSubmitFunc).not.toBeCalled(); //* BUT even after a click, it's still not called due to disabled

      process.env = originalEnv; //* Even if CONTACTABLE == true, if isVerifying == true then no submit called
      unmount(); //* Need full unmount to reset isVerifying to true, rerender won't call useState again
      render(<ContactPageForm onSubmitForm={onSubmitFunc}/>);
      const verifyingSubmitButton = screen.getByRole("button", { name: /checking you're human/i});
      expect(onSubmitFunc).not.toBeCalled(); //* Fresh render and still not called
      await user.click(verifyingSubmitButton);
      expect(onSubmitFunc).not.toBeCalled(); //* In Verifying state, so still disabled, submitFunc still can't fire onClick
    })
  })
  test("that accepts a customizable onSubmit callback", async () => {
    const validationMock = jest.spyOn(Validator, "default").mockReturnValue({ email: [], message: [] });
    const emailSenderMock = jest.spyOn(CommonAPI, "SendEmail").mockImplementation(() => "123");
    const turnstileResponseMock = jest.spyOn(TurnstileAPI, "ProcessTurnstileResponse").mockImplementation(() => "123");
    //? preventDefault prevents a jest-dom form submit "not-implemented" err (better solution may one day come BUT this seems easiest/best)
    //? ALSO this trick assumes usage in onClick or onSubmit that accepts an event param by default!, if the func isn't used in that type of prop
    //? usage will not match since the func call probably won't have any params (or maybe too many!) and jest will throw an error that is e is undefined
    const onSubmitFunc = jest.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ContactPageForm onSubmitForm={onSubmitFunc}/>)

    await user.click(screen.getByRole("button", { name: /turnstile verification button/i })); //* Turnstile finishes verification process
    const contactSubmitButton = await screen.findByRole("button", { name: /contact me/i });
    expect(onSubmitFunc).not.toBeCalled(); //* BUT haven't clicked "Contact Me" button yet
    fireEvent.submit(screen.getByTestId("form-container")) //* Submit form parent is NOT async BUT the callback using onSubmitFunc IS
    await waitFor(() => expect(onSubmitFunc).toHaveBeenCalledTimes(1)); //* So must await it to finish & update mock's # of calls
    
    fireEvent.submit(contactSubmitButton) //* Submit the contact button itself
    await waitFor(() => expect(onSubmitFunc).toHaveBeenCalledTimes(2));
    
    await user.click(contactSubmitButton)
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    const origErrorConsole = SilenceWarning(); //* Temp form submit not implemented error ignore
    rerender(<ContactPageForm />)
    fireEvent.submit(screen.getByTestId("form-container"))
    //* submitFunc prop now null, so it shouldn't be called anymore!
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    fireEvent.submit(contactSubmitButton)
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    await user.click(contactSubmitButton)
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    window.console.error = origErrorConsole; //* Restore error log
    validationMock.mockRestore();
    emailSenderMock.mockRestore();
    turnstileResponseMock.mockRestore();
  })
  test("with validation error messages after invalid data submitted", async () => {
    //! Setup
    const emailSenderMock = jest.spyOn(CommonAPI, "SendEmail").mockImplementation(() => "123");
    const turnstileResponseMock = jest.spyOn(TurnstileAPI, "ProcessTurnstileResponse").mockImplementation(() => "123");
    const validationMock = jest.spyOn(Validator, "default").mockReturnValueOnce({ email: [], message: [] });

    //! Initial click but no validation errors
    const user = userEvent.setup();
    render(<ContactPageForm />);
    await user.click(screen.getByRole("button", { name: /turnstile verification button/i }));
    const contactSubmitButton = await screen.findByRole("button", { name: /contact me/i });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(1);

    //! Just 1 email validation error
    validationMock.mockReturnValueOnce({ email: ["Email invalid error"], message: [] });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/email invalid error/i)).toBeInTheDocument(); //* One error rendered
    //! 2 email validation errors
    validationMock.mockReturnValueOnce({ email: ["Email invalid error 1", "Email invalid error 2"], message: [] });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(3);
    expect(screen.getAllByText(/email invalid error/i).length).toBe(2); //* Both errors are rendered
    //! Just 1 email and 1 message validation error
    validationMock.mockReturnValueOnce({ email: ["Email invalid error"], message: ["Message invalid error"] });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(4);
    expect(screen.getAllByText(/email invalid error/i).length).toBe(1); //* Back to 1 email error rendered
    expect(screen.getByText(/message invalid error/i)).toBeInTheDocument(); //* BUT also have a message error rendered
    //! 2 message validation errors
    validationMock.mockReturnValueOnce({ email: [], message: ["Message invalid error 1", "Message invalid error 2"] });
    await user.click(contactSubmitButton)
    expect(validationMock).toHaveBeenCalledTimes(5);
    expect(screen.getAllByText(/message invalid error/i).length).toBe(2); //* Similarly, 2 message errors can get rendered

    validationMock.mockRestore();
    emailSenderMock.mockRestore();
    turnstileResponseMock.mockRestore();
  })
  test("using viewWidth to control the Turnstile Widget's size", () => {
    const viewWidthContextSpy = jest.spyOn(ViewWidthContext, "default").mockReturnValue(992);
    const { rerender } = render(<ContactPageForm />); 
    //* If viewWidth > 320, the mock TurnstileWidget receives a false compact value, and sets a "normal" class on its container <div>
    expect(screen.getByText("Turnstile Verification Button").parentElement).toHaveClass("normal");
    
    //* If viewWidth <= 320, the mock TurnstileWidget receives a true compact value, and sets a "compact" class on its container <div>
    viewWidthContextSpy.mockReturnValue(320);
    rerender(<ContactPageForm />);
    expect(screen.getByText("Turnstile Verification Button").parentElement).toHaveClass("compact");

    viewWidthContextSpy.mockRestore();
  })
})