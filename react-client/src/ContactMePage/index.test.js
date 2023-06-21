import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactPage from ".";
import { averageTabletLowEndWidth, averageTabletViewWidth } from "../Utility/Constants/Viewports";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
import * as CommonAPI from "../Data/Api/Common";
import * as Validator from "./validator";
import * as TurnstileAPI from "../Data/Api/ThirdParty";

//? jest.mock() hoists above imports which makes it file wide and work for every test below SO
//? If a per-test option is needed, must use "jest.doMock()" (See ContactPageForm.test for example)
jest.mock("../ThirdParty/TurnstileWidget", () => ({ action, compact, successCB, className }) => (
  <div>Turnstile Verification Widget</div>
)); 

describe("renders a simple contact page with a form component", () => {
  test("with a parent & form container using css modules, & form in dark mode", () => {
    render(<ContactPage />);
    const headerTag = screen.getByRole("heading", { name: /contact me/i });
    const parentContainer = headerTag.parentElement;
    expect(parentContainer).toBeInTheDocument();
    expect(parentContainer).toHaveClass("contact-page", { exact: true });

    const formParentContainer = headerTag.nextSibling;
    expect(formParentContainer).toBeInTheDocument();
    expect(formParentContainer).toHaveClass("form-parent-container", { exact: true });

    const formComponent = formParentContainer.firstChild;
    expect(formComponent).toBeInTheDocument();
    expect(formComponent).toHaveClass("dark");
  })
  test("that depends on viewWidth for correct title font size", () => {
    const useViewWidthSpy = jest.spyOn(ViewWidthContext, "default").mockReturnValue(averageTabletLowEndWidth);
    
    const { rerender } = render(<ContactPage />);
    const title = screen.getByRole("heading", { name: /contact me/i });
    expect(title).toHaveClass("display-3");

    useViewWidthSpy.mockReturnValue(averageTabletViewWidth);
    rerender(<ContactPage />);
    expect(title).toHaveClass("display-2");

    useViewWidthSpy.mockRestore();
  })
  test("that accepts a submit form callback", async () => {
    const validationMock = jest.spyOn(Validator, "default").mockReturnValue({ email: [], message: [] });
    //? Must mock SendEmail to avoid network request. Mocking ProcessTurnstile just saves time (no network request performed in it)
    const emailSenderMock = jest.spyOn(CommonAPI, "SendEmail").mockImplementation(() => "123");
    const turnstileResponseMock = jest.spyOn(TurnstileAPI, "ProcessTurnstileResponse").mockImplementation(() => "123");
    const onSubmitFunc = jest.fn();

    const { rerender } = render(<ContactPage onSubmitForm={onSubmitFunc} />);
    fireEvent.submit(screen.getByTestId("form-container"));
    await waitFor(() => expect(onSubmitFunc).toHaveBeenCalledTimes(1)); //* Upon submitting, the form should call the ContactPage's submit prop

    rerender(<ContactPage />);
    fireEvent.submit(screen.getByTestId("form-container"));
    await waitFor(() => expect(onSubmitFunc).toHaveBeenCalledTimes(1)); //* It won't call anything
    
    validationMock.mockRestore();
    emailSenderMock.mockRestore();
    turnstileResponseMock.mockRestore();
  })
})