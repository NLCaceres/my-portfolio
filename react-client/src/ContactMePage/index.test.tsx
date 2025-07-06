import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ContactPage from ".";
import { averageTabletLowEndWidth, averageTabletViewWidth } from "../Utility/Constants/Viewports";
import { createRootRouteWithContext, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import * as ContactPageForm from "./ContactPageForm";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
//import * as RoutingContext from "../Routing/AppRouting";
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

const testRouter = (showAlert: () => boolean ) => {
  const rootRoute = createRootRouteWithContext<{ showAlert: () => boolean }>()({
    component: Outlet
  });
  const indexRoute = createRoute({ //? Need this route since ContactPage uses `contactMeRouteAPI`
    getParentRoute: () => rootRoute, path: "/contact-me", component: ContactPage
  });
  const router = createRouter({
    context: { showAlert }, routeTree: rootRoute.addChildren([indexRoute])
  });
  router.navigate({ to: "/contact-me" });
  return router;
};
describe("renders a simple contact page with a form component", () => {
  afterEach(() => { vi.restoreAllMocks(); });

  test("with a parent & form container using css modules, & form in dark mode", async () => {
    //? RouteContext can be simple since it's not called anyway AND type won't really matter
    render(<RouterProvider router={testRouter(() => true)} />);
    const headerTag = await screen.findByRole("heading", { name: /contact me/i });
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
  test("providing a submit contact function to its child", async () => {
    const user = userEvent.setup();
    const showAlertMock = vi.fn();
    let isSuccessful = true;
    vi.spyOn(ContactPageForm, "default")
      .mockImplementation((
        { onSubmitForm }: { onSubmitForm?: (successful: boolean) => void, darkMode?: boolean }
      ) =>
        <button onClick={() => { onSubmitForm && onSubmitForm(isSuccessful); }}>Foobar</button>
      );
    render(<RouterProvider router={testRouter(showAlertMock)} />);
    expect(showAlertMock).not.toHaveBeenCalled();

    await user.click(await screen.findByText("Foobar"));
    expect(showAlertMock).toHaveBeenCalledOnce();
    expect(showAlertMock).toHaveBeenLastCalledWith({
      color: "success", title: "Email sent!",
      message: "Successfully sent your message! I should get back to you soon!"
    });

    isSuccessful = false;
    await user.click(screen.getByText("Foobar"));
    expect(showAlertMock).toHaveBeenLastCalledWith({
      color: "danger", title: "Sorry! Your email wasn't sent!",
      message: "Hopefully I'll have everything back up and running soon! In the mean time, enjoy the rest of my portfolio. Thanks!"
    });
  });
  test("that depends on viewWidth for correct title font size", async () => {
    const useViewWidthSpy = vi.spyOn(ViewWidthContext, "default")
      .mockReturnValue(averageTabletLowEndWidth);

    const { rerender } = render(<RouterProvider router={testRouter(() => true)} />);
    const title = await screen.findByRole("heading", { name: /contact me/i });
    expect(title).toHaveClass("display-3");

    useViewWidthSpy.mockReturnValue(averageTabletViewWidth);
    rerender(<RouterProvider router={testRouter(() => true)} />);
    expect(await screen.findByRole("heading", { name: /contact me/i })).toHaveClass("display-2");
  });
  test("that depends and uses callbacks from the RoutingContext", async () => {
    const showAlertMock = vi.fn();
    const showDialogMock = vi.fn();
    vi.spyOn(Validator, "default").mockReturnValue({ email: [], message: [] });
    //? Mock the `SendEmail` to avoid network request. Mock `Turnstile` just to save time
    vi.spyOn(CommonAPI, "SendEmail").mockImplementation(() => Promise.resolve("123"));
    vi.spyOn(TurnstileAPI, "ProcessTurnstileResponse")
      .mockImplementation(() => Promise.resolve(true));

    const { rerender } = render(<RouterProvider router={testRouter(showAlertMock)} />);
    fireEvent.submit(await screen.findByTestId("form-container"));
    //* WHEN form submits, THEN run `RouteContext.showAlert` in `submitContactForm`
    await waitFor(() => expect(showAlertMock).toHaveBeenCalledTimes(1));
    expect(showDialogMock).toHaveBeenCalledTimes(0); //* ONLY the alert appears, not the modal

    rerender(<RouterProvider router={testRouter(showAlertMock)} />);
    fireEvent.submit(await screen.findByTestId("form-container"));
    //* WHEN the form tries to re-submit, THEN the mock ISN'T called again
    await waitFor(() => expect(showAlertMock).toHaveBeenCalledTimes(1));
  });
});
