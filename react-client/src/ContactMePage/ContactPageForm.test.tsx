import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { vi, type MockInstance } from "vitest";
import userEvent from "@testing-library/user-event";
import ContactPageForm from "./ContactPageForm";
import * as TurnstileWidget from "../ThirdParty/TurnstileWidget";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
import * as CommonAPI from "../Data/Api/Common";
import * as Validator from "./validator";
import * as TurnstileAPI from "../Data/Api/ThirdParty";

type TurnstileWidgetProps = TurnstileWidget.TurnstileWidgetProps;
describe("renders the form for the contact page", () => {
  let turnstileWidgetMock: MockInstance;
  beforeEach(() => {
    turnstileWidgetMock = vi.spyOn(TurnstileWidget, "default").mockImplementation(({ compact, successCB }: TurnstileWidgetProps) => {
      const compactClass = (compact) ? "compact" : "normal";
      return (<div className={compactClass}><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
    })
  })
  test("that has a toggleable dark mode", async () => {
    const { rerender } = render(<ContactPageForm darkMode={false} />);
    const formContainer = screen.getByTestId("form-container");
    expect(formContainer).not.toHaveClass("dark");

    rerender(<ContactPageForm darkMode />);
    expect(formContainer).toHaveClass("dark");

    rerender(<ContactPageForm />);
    expect(formContainer).not.toHaveClass("dark");
  })
  describe("that depends on '_CONTACTABLE' env var for conditionally rendering", () => {
    test("a spinner in the submit button when running an async task", async () => {
      expect(import.meta.env.VITE_CONTACTABLE).toBe("true");
      const user = userEvent.setup(); //? Best to setup userEvent 1st or at least before render is called
      const { unmount } = render(<ContactPageForm />);
      //* WHEN VITE_CONTACTABLE == "true" + isVerifying = true, THEN the spinner is visible to show verification in process
      const submitButtonSpinner = screen.getByRole("status", { hidden: true });
      expect(submitButtonSpinner).toBeInTheDocument();

      import.meta.env.VITE_CONTACTABLE = "false";
      expect(import.meta.env.VITE_CONTACTABLE).toBe("false");
      unmount();
      const { unmount: secondUnmount } = render(<ContactPageForm />);
      //* WHEN VITE_CONTACTABLE == "false" while isVerifying = true, THEN no spinner needed since no verification going to happen
      expect(screen.queryByRole("status", { hidden: true })).not.toBeInTheDocument();

      import.meta.env.VITE_CONTACTABLE = "true";
      secondUnmount();
      render(<ContactPageForm />);
      //* WHEN VITE_CONTACTABLE == "true" + isVerifying = true, THEN spinner is visible
      const finalSubmitButtonSpinner = screen.getByRole("status", { hidden: true });
      expect(finalSubmitButtonSpinner).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /turnstile verification button/i }));
      //* AND once the verification completes, THEN the spinner will disappear
      expect(finalSubmitButtonSpinner).not.toBeInTheDocument();
    })
    test("a submit button with 'unavailable', 'verifying', or 'contact me' text states", async () => {
      import.meta.env.VITE_CONTACTABLE = "false";
      const user = userEvent.setup();
      const { unmount } = render(<ContactPageForm />); //* Starts as Contactable = false + isVerifying = true
      //* WHEN VITE_CONTACTABLE == "false", THEN the submit button will read "currently unavailable"
      const unavailableSubmitButton = screen.getByRole("button", { name: /currently unavailable/i });
      expect(unavailableSubmitButton).toBeInTheDocument();
      unmount();

      import.meta.env.VITE_CONTACTABLE = "true";
      expect(import.meta.env.VITE_CONTACTABLE).toBe("true");
      const { unmount: secondUnmount } = render(<ContactPageForm />); //* NOW: Starts as Contactable = true + isVerifying = true
      //* WHEN VITE_CONTACTABLE == "true", THEN the submit button will read as "Checking you're human!" indicating verification started
      const verifyingSubmitButton = screen.getByRole("button", { name: /checking you're human!/i });
      expect(verifyingSubmitButton).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /turnstile verification button/i }));
      //* WHEN the Turnstile Verification completes onClick, THEN the submit button will read as "Contact Me"
      const contactMeButton = await screen.findByRole("button", { name: /contact me/i });
      expect(contactMeButton).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /checking you're human!/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /currently unavailable/i })).not.toBeInTheDocument();
      secondUnmount();
    })
    test("a disabled submit button that won't run the submitFunc prop", async () => {
      import.meta.env.VITE_CONTACTABLE = "false";
      const user = userEvent.setup();
      const onSubmitFunc = vi.fn();
      const { unmount } = render(<ContactPageForm onSubmitForm={onSubmitFunc} />);
      //* WHEN VITE_CONTACTABLE == "false", THEN contact button displays "currently unavailable"
      const submitButton = screen.getByRole("button", { name: /currently unavailable/i});
      expect(onSubmitFunc).not.toBeCalled(); //* Submit callback spy not yet called
      await user.click(submitButton); //* FireEvent would force a form submission, so definitely better to use UserEvent
      expect(onSubmitFunc).not.toBeCalled(); //* AND the submit spy is not called due to VITE_CONTACTABLE == "false"

      import.meta.env.VITE_CONTACTABLE = "true"; //* Even if CONTACTABLE == true, if isVerifying == true then no submit called
      unmount(); //* Need full unmount to have useState reset isVerifying to its initial state of `true`
      render(<ContactPageForm onSubmitForm={onSubmitFunc} />);
      const verifyingSubmitButton = screen.getByRole("button", { name: /checking you're human/i});
      expect(onSubmitFunc).not.toBeCalled();
      await user.click(verifyingSubmitButton); //* WHEN contact button clicked, and CONTACTABLE == "true" AND isVerifying == `true`
      expect(onSubmitFunc).not.toBeCalled(); //* THEN the submit spy still won't run since the component is stuck verifying
    })
    test("a try again state in the submit button if bot detected trying to submit", async () => {
      turnstileWidgetMock.mockImplementation(({ successCB }: TurnstileWidgetProps) => {
        return (<div><button type="button" onClick={() => { successCB(undefined) }}>Turnstile Verification Button</button></div>);
      })
      const user = userEvent.setup();
      render(<ContactPageForm />);

      expect(screen.queryByRole("button", { name: /checking you're human!/i })).toBeInTheDocument();
      //* WHEN Turnstile returns an undefined auth token
      await user.click(screen.getByRole("button", { name: /turnstile verification button/i }));

      //* THEN the Form's submit button should read "Try Again Later", not any other message
      expect(screen.queryByRole("button", { name: /try again later/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /checking you're human!/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /currently unavailable/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /contact me/i })).not.toBeInTheDocument();
    })
  })
  test("that accepts a customizable onSubmit callback", async () => {
    vi.spyOn(Validator, "default").mockReturnValue({ email: [], message: [] });
    vi.spyOn(CommonAPI, "SendEmail").mockResolvedValue("123");
    vi.spyOn(TurnstileAPI, "ProcessTurnstileResponse").mockResolvedValue(true);
    const onSubmitFunc = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ContactPageForm onSubmitForm={onSubmitFunc} />);

    await user.click(screen.getByRole("button", { name: /turnstile verification button/i })); //* Turnstile finishes verification process
    const contactSubmitButton = await screen.findByRole("button", { name: /contact me/i }); //* SO contact submit button now visible
    expect(onSubmitFunc).not.toBeCalled(); //* Haven't clicked submit button yet so spy not called yet

    //? preventDefault() + stopPropagation() in SubmitContactForm prevent a page reload AND jest-dom's "submit" not-implemented error
    fireEvent.submit(screen.getByTestId("form-container")); //? whenever fireEvent causes a form submission
    //* WHEN form submitted after successful Turnstile verification, THEN run the onSubmit callback
    await waitFor(() => expect(onSubmitFunc).toHaveBeenCalledTimes(1)); //* Wait for fireEvent's submission to run the callback
    
    fireEvent.submit(contactSubmitButton); //* Submit by emitting a "submit" event from the contact button itself
    await waitFor(() => expect(onSubmitFunc).toHaveBeenCalledTimes(2));
    
    await user.click(contactSubmitButton); //* Submit by directly pressing the contact button
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    rerender(<ContactPageForm />);
    //* WHEN no submit callback prop passed to ContactPageForm
    fireEvent.submit(screen.getByTestId("form-container"));
    expect(onSubmitFunc).toHaveBeenCalledTimes(3); //* THEN my spy is not called anymore
    //* No matter how the form is submitted
    fireEvent.submit(contactSubmitButton);
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);

    await user.click(contactSubmitButton);
    expect(onSubmitFunc).toHaveBeenCalledTimes(3);
  })
  test("with validation error messages after invalid data submitted", async () => {
    vi.spyOn(CommonAPI, "SendEmail").mockResolvedValue("123");
    vi.spyOn(TurnstileAPI, "ProcessTurnstileResponse").mockResolvedValue(true);
    const validationMock = vi.spyOn(Validator, "default").mockReturnValueOnce({ email: [], message: [] });
    const user = userEvent.setup();
    render(<ContactPageForm />);
    await user.click(screen.getByRole("button", { name: /turnstile verification button/i }));
    const contactSubmitButton = await screen.findByRole("button", { name: /contact me/i });
    //* WHEN ContactPageForm submits after successful Turnstile verification
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(1); //* THEN validator runs

    validationMock.mockReturnValueOnce({ email: ["Email invalid error"], message: [] });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(2);
    //* WHEN validator returns an error message, THEN it is rendered as is
    expect(screen.getByText(/email invalid error/i)).toBeInTheDocument();

    validationMock.mockReturnValueOnce({ email: ["Email invalid error 1", "Email invalid error 2"], message: [] });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(3);
    //* WHEN the validator returns multiple errors, THEN BOTH are rendered as is
    expect(screen.getAllByText(/email invalid error/i).length).toBe(2);

    validationMock.mockReturnValueOnce({ email: ["Email invalid error"], message: ["Message invalid error"] });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(4);
    //* WHEN the validator returns an error for each field, THEN BOTH are rendered (albeit separately)
    expect(screen.getAllByText(/email invalid error/i).length).toBe(1);
    expect(screen.getByText(/message invalid error/i)).toBeInTheDocument();

    validationMock.mockReturnValueOnce({ email: [], message: ["Message invalid error 1", "Message invalid error 2"] });
    await user.click(contactSubmitButton);
    expect(validationMock).toHaveBeenCalledTimes(5);
    //* WHEN the validator returns multiple errors, THEN BOTH are rendered as is (just like the "email" field before)
    expect(screen.getAllByText(/message invalid error/i).length).toBe(2);
  })
  test("using viewWidth to control the Turnstile Widget's size", async () => {
    const viewWidthContextSpy = vi.spyOn(ViewWidthContext, "default").mockReturnValue(992);
    const { rerender } = render(<ContactPageForm />); 
    //* WHEN viewWidth > 320, THEN TurnstileWidget is rendered via "normal" css class
    expect(screen.getByText("Turnstile Verification Button").parentElement).toHaveClass("normal");
    
    //* WHEN viewWidth <= 320,
    viewWidthContextSpy.mockReturnValue(320);
    rerender(<ContactPageForm />);
    //* THEN TurnstileWidget is rendered via "compact" css class
    expect(screen.getByText("Turnstile Verification Button").parentElement).toHaveClass("compact");
  })
})