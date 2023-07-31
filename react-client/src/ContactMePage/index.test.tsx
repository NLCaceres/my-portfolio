import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactPage from ".";
import { averageTabletLowEndWidth, averageTabletViewWidth } from "../Utility/Constants/Viewports";
import { type AlertState } from "../AppAlert/AppAlert";
import { type TurnstileWidgetProps } from "../ThirdParty/TurnstileWidget";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
import * as RoutingContext from "../Routing/AppRouting";
import * as CommonAPI from "../Data/Api/Common";
import * as Validator from "./validator";
import * as TurnstileAPI from "../Data/Api/ThirdParty";

//? jest.mock() hoists above imports which makes it file wide and work for every test below SO
//? If a per-test option is needed, must use "jest.doMock()" (See ContactPageForm.test for example)
jest.mock("../ThirdParty/TurnstileWidget", () => (_: TurnstileWidgetProps) => (
  <div>Turnstile Verification Widget</div>
)); 

describe("renders a simple contact page with a form component", () => {
  test("with a parent & form container using css modules, & form in dark mode", () => {
    jest.spyOn(RoutingContext, "useRoutingContext")
      .mockReturnValue([(_: boolean) => { return true }, (__: AlertState) => {}]);
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
    jest.restoreAllMocks();
  })
  test("that depends on viewWidth for correct title font size", () => {
    jest.spyOn(RoutingContext, "useRoutingContext")
      .mockReturnValue([(_: boolean) => { return true }, (__: AlertState) => {}]);
    const useViewWidthSpy = jest.spyOn(ViewWidthContext, "default").mockReturnValue(averageTabletLowEndWidth);
    
    const { rerender } = render(<ContactPage />);
    const title = screen.getByRole("heading", { name: /contact me/i });
    expect(title).toHaveClass("display-3");

    useViewWidthSpy.mockReturnValue(averageTabletViewWidth);
    rerender(<ContactPage />);
    expect(title).toHaveClass("display-2");

    jest.restoreAllMocks();
  })
  test("that depends and uses callbacks from the RoutingContext", async () => {
    const showModalMock = jest.fn();
    const showAlertMock = jest.fn();
    jest.spyOn(RoutingContext, "useRoutingContext")
      .mockReturnValue([showModalMock, showAlertMock]);
    jest.spyOn(Validator, "default").mockReturnValue({ email: [], message: [] });
    //? Must mock SendEmail to avoid network request. Mocking ProcessTurnstile just saves time (no network request performed in it)
    jest.spyOn(CommonAPI, "SendEmail").mockImplementation(() => Promise.resolve("123"));
    jest.spyOn(TurnstileAPI, "ProcessTurnstileResponse")
      .mockImplementation((_: Promise<unknown>, __?: string) => Promise.resolve(true));

    const { rerender } = render(<ContactPage />);
    fireEvent.submit(screen.getByTestId("form-container"));
    await waitFor(() => expect(showAlertMock).toHaveBeenCalledTimes(1)); //* Upon submitting, the form should call the ContactPage's submit func
    expect(showModalMock).toHaveBeenCalledTimes(0); //* ONLY using 1 callback func received from the RoutingContextProvider

    rerender(<ContactPage />);
    fireEvent.submit(screen.getByTestId("form-container"));
    await waitFor(() => expect(showAlertMock).toHaveBeenCalledTimes(1)); //* It won't call anything
    
    jest.restoreAllMocks();
  })
})