import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ContactPage from ".";
import { averageTabletLowEndWidth, averageTabletViewWidth } from "../Utility/Constants/Viewports";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
import * as RoutingContext from "../Routing/AppRouting";
import * as CommonAPI from "../Data/Api/Common";
import * as Validator from "./validator";
import * as TurnstileAPI from "../Data/Api/ThirdParty";

//? vi.mock() hoists above imports which makes it file wide and work for every test below SO
//? If a per-test option is needed, must use "vi.doMock()" (See ContactPageForm.test for example)
vi.mock("../ThirdParty/TurnstileWidget", () => {
  return {
    default: () => (<div>Turnstile Verification Button</div>)
  };
});

describe("renders a simple contact page with a form component", () => {
  test("with a parent & form container using css modules, & form in dark mode", () => {
    vi.spyOn(RoutingContext, "useRoutingContext")
      .mockReturnValue([() => { return true; }, () => { }]); //? Simple mocks that won't get called anyway (so type doesn't matter)
    render(<ContactPage />);
    const headerTag = screen.getByRole("heading", { name: /contact me/i });
    const parentContainer = headerTag.parentElement;
    expect(parentContainer).toBeInTheDocument();
    expect(parentContainer).toHaveClass("contact-page", { exact: true });

    const formParentContainer = headerTag.nextSibling;
    expect(formParentContainer).toBeInTheDocument();
    expect(formParentContainer).toHaveClass("form-parent-container", { exact: true });

    const formComponent = formParentContainer!.firstChild;
    expect(formComponent).toBeInTheDocument();
    expect(formComponent).toHaveClass("dark");
  });
  test("that depends on viewWidth for correct title font size", () => {
    vi.spyOn(RoutingContext, "useRoutingContext")
      .mockReturnValue([() => { return true; }, () => { }]); //* Simple mocks that won't get called
    const useViewWidthSpy = vi.spyOn(ViewWidthContext, "default").mockReturnValue(averageTabletLowEndWidth);

    const { rerender } = render(<ContactPage />);
    const title = screen.getByRole("heading", { name: /contact me/i });
    expect(title).toHaveClass("display-3");

    useViewWidthSpy.mockReturnValue(averageTabletViewWidth);
    rerender(<ContactPage />);
    expect(title).toHaveClass("display-2");
  });
  test("that depends and uses callbacks from the RoutingContext", async () => {
    const showModalMock = vi.fn();
    const showAlertMock = vi.fn();
    vi.spyOn(RoutingContext, "useRoutingContext")
      .mockReturnValue([showModalMock, showAlertMock]);
    vi.spyOn(Validator, "default").mockReturnValue({ email: [], message: [] });
    vi.spyOn(CommonAPI, "SendEmail").mockImplementation(() => Promise.resolve("123")); //? Mocked to avoid network request
    vi.spyOn(TurnstileAPI, "ProcessTurnstileResponse") //? Mocked just to save time (since no network request is run here)
      .mockImplementation(() => Promise.resolve(true));

    const { rerender } = render(<ContactPage />);
    fireEvent.submit(screen.getByTestId("form-container"));
    //* WHEN the form submits, THEN it will run the RoutingContext provided func, showAlert, via ContactPage's submitContactForm method
    await waitFor(() => expect(showAlertMock).toHaveBeenCalledTimes(1)); //* ONLY showAlert is used
    expect(showModalMock).toHaveBeenCalledTimes(0); //* NOT the showModal RoutingContext provides

    rerender(<ContactPage />);
    fireEvent.submit(screen.getByTestId("form-container"));
    await waitFor(() => expect(showAlertMock).toHaveBeenCalledTimes(1)); //* Form doesn't re-submit so mock not called again
  });
});