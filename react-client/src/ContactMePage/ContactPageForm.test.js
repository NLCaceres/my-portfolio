import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPageForm from "./ContactPageForm";
import * as CommonAPI from "../Api/Common";
import * as TurnstileAPI from "../Api/ThirdParty";
import SilenceWarning from "../Utility/Functions/Tests/WarningSilencer";

const originalEnv = process.env;
jest.mock("../Utility/Components/TurnstileWidget", () => ({action, successCB, className }) => {
  return (<div><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
})

// const tokenTurnstileMock = ({action, successCB, className }) => { //? Useful if using doMock like in line 21
//   //* Why a button? Easiest way to activate callback + it matches the Turnstile Challenge button in terms of UX
//   return (<div><button type="button" onClick={() => { successCB("123") }}>Dummy Node</button></div>);
// }
describe("renders the form for the contact page", () => {
  // beforeEach(() => { jest.resetModules(); }) //* As of Jest 27, resetModules() seems bugged, crashing Functional React Components using Hooks
  test("that has a toggleable dark mode", async () => {
    //? If just mocking the default export (and not importing any others) then the following works! OTHERWISE: See line 56
    //* jest.doMock("../Utility/Components/TurnstileWidget", () => tokenTurnstileMock);
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
    test("an unavailable, verifying, & contact me state in the submit button", async () => {
      //? If multiple imports needed from file, then must return an object w/ following syntax (__esModule key is very important!)
      //? Only want to partially mock the file? THEN Run 'const originalModule = jest.requireActual('dir/path/from/here')', 
      //? then add '...originalModule' to below returned obj, only overriding what's necessary
      // jest.doMock('../Utility/Components/TurnstileWidget', () => { 
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
      expect(verifyingSubmitButton).toBeInTheDocument(); //* Get 'verifying' button, NOT 'unavailable' button

      await user.click(screen.getByRole("button", { name: /turnstile verification button/i })); //* Click turnstile widget button
      const contactMeButton = await screen.findByRole("button", { name: /contact me/i });
      expect(contactMeButton).toBeInTheDocument(); //* After verification succeeds and stops, "Contact Me" appears!
      expect(screen.queryByRole("button", { name: /checking you're human!/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /currently unavailable/i })).not.toBeInTheDocument();
      secondUnmount();
    })
    //! Moved actual testable version of this test to another file to allow mock to work as expected
    // test("a try again state in the submit button if computer detected trying to submit", () => {
    //   //! As of Jest 27, resetModules seems bugged if a React Functional Component uses Hooks
    //   jest.isolateModules(async () => { //! BUT isolateModules SOMETIMES seems to work in its place to change a mock mid-test
    //     //? The one problem w/ isolateModules is it CANNOT contain anything from the outside scope
    //     console.log("Starting try again state test")
    //     jest.doMock('../Utility/Components/TurnstileWidget', () => {
    //       return { //? Since it doesn't know about the outside scope, we can't use tokenTurnstileMock
    //         __esModule: true, //? And must define a new mock below NO MATTER WHAT
    //         default: ({action, successCB, className }) => {
    //           return (<div><button type="button" onClick={() => { successCB(undefined) }}>Turnstile Verification Button</button></div>);
    //         }
    //       } 
    //     });
    //?  Additionally, it seems to stop the block when using async functions other than 'await import()'
    //     const ContactPageFormImport = await import("./ContactPageForm");
    //     const ContactPageForm = ContactPageFormImport.default;
    //     render(<ContactPageForm />);
    //     expect(screen.queryByRole('button', { name: /checking you're human!/i })).toBeInTheDocument();
    //     fireEvent.click(screen.getByRole('button', { name: /turnstile verification button/i })); 
    //? UserEvent.click() and findByRole seem to be the main issue BUT even w/out them, it suggests there's an async function pending
    //? that is causing the test to stop in its tracks and pretend the test passed (despite not calling the following expects)
    //     expect(screen.queryByRole('button', { name: /try again later/i })).toBeInTheDocument();
    //     expect(screen.queryByRole('button', { name: /checking you're human!/i })).not.toBeInTheDocument();
    //     expect(screen.queryByRole('button', { name: /currently unavailable/i })).not.toBeInTheDocument();
    //     expect(screen.queryByRole('button', { name: /contact me/i })).not.toBeInTheDocument();
    //     console.log("Finishing isolated modules block");
    //   })
    // })
    test("a disabled submit button that can't fire the submitFunc prop if '_CONTACTABLE' = false OR 'isVerifying' = true", async () => {
      process.env = { ...originalEnv, REACT_APP_CONTACTABLE: "false" }
      const user = userEvent.setup();
      const onSubmitFunc = jest.fn(e => e.preventDefault());
      const { unmount } = render(<ContactPageForm onSubmitForm={onSubmitFunc}/>);
      const submitButton = screen.getByRole("button", { name: /currently unavailable/i});
      expect(onSubmitFunc).not.toBeCalled(); //* No click tried so naturally not called!
      await user.click(submitButton) //* If used fireEvent for a submit event, form would fire the func anyway!
      expect(onSubmitFunc).not.toBeCalled(); //* BUT even after a click, it's still not called due to disabled

      process.env = originalEnv;
      unmount(); //* Need full unmount to reset isVerifying to true, rerender won't call useState again
      render(<ContactPageForm onSubmitForm={onSubmitFunc}/>);
      const verifyingSubmitButton = screen.getByRole("button", { name: /checking you're human/i});
      expect(onSubmitFunc).not.toBeCalled(); //* Fresh render and still not called
      await user.click(verifyingSubmitButton);
      expect(onSubmitFunc).not.toBeCalled(); //* In Verifying state, so still disabled, submitFunc still can't fire onClick
    })
  })
  test("that accepts a customizable onSubmit callback", async () => {
    const emailSenderMock = jest.spyOn(CommonAPI, "SendEmail").mockImplementation(() => "123");
    const turnstileResponseMock = jest.spyOn(TurnstileAPI, "ProcessTurnstileResponse").mockImplementation(() => "123");
    //? preventDefault prevents a jest-dom form submit 'not-implemented' err (better solution may one day come BUT this seems easiest/best)
    //? ALSO this trick assumes usage in onClick or onSubmit that accepts an event param by default!, if the func isn't used in that type of prop
    //? usage will not match since the func call probably won't have any params (or maybe too many!) and jest will throw an error that is e is undefined
    const onSubmitFunc = jest.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ContactPageForm onSubmitForm={onSubmitFunc}/>)
    await user.click(screen.getByRole("button", { name: /turnstile verification button/i }));
    const contactSubmitButton = await screen.findByRole("button", { name: /contact me/i });
    expect(onSubmitFunc).not.toBeCalled();
    
    fireEvent.submit(screen.getByTestId("form-container")) //* Not async BUT the callback using onSubmitFunc IS
    await waitFor(() => expect(onSubmitFunc).toHaveBeenCalledTimes(1)); //* So must await it to finish & update mock's # of calls
    
    fireEvent.submit(contactSubmitButton)
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
    emailSenderMock.mockRestore();
    turnstileResponseMock.mockRestore();
  })
})